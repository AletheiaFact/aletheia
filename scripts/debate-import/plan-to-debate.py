#!/usr/bin/env python3
"""Append government-plan statements from the pre-check sheet to an Aletheia
debate as draft transcript turns.

Dry run by default: prints the turns it would send. With --send it POSTs them
to /api/claim/debate/<debateId>/append, authenticated as a person with your
browser session cookie (ALETHEIA_COOKIE, the `ory_session_...=...` cookie of a
fact-checker logged in on the site) or with a bearer token (ALETHEIA_TOKEN,
e.g. an M2M token). The turns arrive as drafts; a person approves them in the
debate's transcript drafts panel.

Usage:
  python3 plan-to-debate.py                 # dry run, prints the turns
  ALETHEIA_COOKIE='ory_session_...=...' python3 plan-to-debate.py --send --limit 1
  ALETHEIA_TOKEN=... python3 plan-to-debate.py --send
Options:
  --limit N    only the first N turns (e.g. --limit 1 to test one row)
  --all        include paraphrased rows too (default: only rows that quote the plan)
  --base URL   default https://aletheiafact.org
  --debate ID  debate content id (the claim's contentId, not the claim id);
               default 6adbd57988c1214b039c28ea
"""
import argparse
import csv
import io
import json
import os
import re
import sys
import urllib.request

SHEET_CSV = (
    "https://docs.google.com/spreadsheets/d/"
    "1ltAEdTl-URICw3WcBOTUSMZhpjwzYBwdCCE5GapIBDA/export?format=csv&gid=485802486"
)
# Production personality ids of the debate's two participants.
PERSONALITIES = {
    "Lula": "635c52f4e7d6d50033a2b7c4",
    "Flávio Bolsonaro": "690b77bc5e479400231a57ae",
}
SKIP_TYPES = {"Omissão do plano"}  # records what a plan leaves out, not a statement
BATCH = 50  # DEBATE_TRANSCRIPT_MAX_TURNS
QUOTE_START = re.compile(r"^\s*[‘'\"“]")


def load_rows():
    with urllib.request.urlopen(SHEET_CSV) as response:
        text = response.read().decode("utf-8")
    rows = list(csv.reader(io.StringIO(text)))
    header = rows[0]
    return [
        dict(zip(header, row))
        for row in rows[1:]
        if len(row) > 1 and row[0].strip() and any(c.strip() for c in row[1:])
    ]


def to_turn(row):
    page = row["Página do plano"].strip()
    where = f"Plano de governo, p. {page}" if page and page != "—" else "Plano de governo"
    return {
        "personality": PERSONALITIES[row["Candidato"]],
        # The source is in the text so the turn never reads as live speech.
        "text": f"[{where}] {row['O que o plano diz'].strip()}",
        "externalId": f"plano-{row['ID']}",
    }


def auth_headers():
    cookie = os.environ.get("ALETHEIA_COOKIE")
    token = os.environ.get("ALETHEIA_TOKEN")
    if cookie:
        # A person's browser session; the endpoint checks the session first.
        return {"Cookie": cookie}
    if token:
        return {"Authorization": f"Bearer {token}"}
    sys.exit("Set ALETHEIA_COOKIE (your browser session) or ALETHEIA_TOKEN to send")


def post(base, debate, headers, turns):
    request = urllib.request.Request(
        f"{base}/api/claim/debate/{debate}/append",
        data=json.dumps({"turns": turns}).encode("utf-8"),
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    with urllib.request.urlopen(request) as response:
        return response.status, response.read().decode("utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true")
    parser.add_argument("--limit", type=int, help="only the first N turns")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--base", default="https://aletheiafact.org")
    # The endpoint takes the debate content id (claim.contentId), not the
    # claim id: claim 6adbd57988c1214b039c28e8 has content 6adbd57988c1214b039c28ea.
    parser.add_argument("--debate", default="6adbd57988c1214b039c28ea")
    args = parser.parse_args()

    rows = [r for r in load_rows() if r["Tipo de registro"] not in SKIP_TYPES]
    if not args.all:
        rows = [r for r in rows if QUOTE_START.match(r["O que o plano diz"])]
    turns = [to_turn(r) for r in rows]
    if args.limit is not None:
        turns = turns[: args.limit]
        rows = rows[: args.limit]
    print(f"{len(turns)} turns ({sum(r['Candidato'] == 'Lula' for r in rows)} Lula, "
          f"{sum(r['Candidato'] != 'Lula' for r in rows)} Flávio)", file=sys.stderr)

    if not args.send:
        print(json.dumps(turns, ensure_ascii=False, indent=2))
        return
    headers = auth_headers()
    for start in range(0, len(turns), BATCH):
        status, body = post(args.base, args.debate, headers, turns[start:start + BATCH])
        print(f"batch {start // BATCH + 1}: HTTP {status} {body[:300]}")


if __name__ == "__main__":
    main()
