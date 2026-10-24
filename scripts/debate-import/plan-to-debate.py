#!/usr/bin/env python3
"""Append government-plan statements from the pre-check sheet to an Aletheia
debate as draft transcript turns.

Dry run by default: prints the turns it would send. With --send it POSTs them
to /api/claim/debate/<debateId>/append, authenticated with the bearer token in
the ALETHEIA_TOKEN environment variable (an M2M token or a fact-checker
session token). The turns arrive as drafts; a person approves them in the
debate's transcript drafts panel.

Usage:
  python3 plan-to-debate.py                 # dry run, prints the turns
  ALETHEIA_TOKEN=... python3 plan-to-debate.py --send
Options:
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


def post(base, debate, token, turns):
    request = urllib.request.Request(
        f"{base}/api/claim/debate/{debate}/append",
        data=json.dumps({"turns": turns}).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        method="POST",
    )
    with urllib.request.urlopen(request) as response:
        return response.status, response.read().decode("utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true")
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
    print(f"{len(turns)} turns ({sum(r['Candidato'] == 'Lula' for r in rows)} Lula, "
          f"{sum(r['Candidato'] != 'Lula' for r in rows)} Flávio)", file=sys.stderr)

    if not args.send:
        print(json.dumps(turns, ensure_ascii=False, indent=2))
        return
    token = os.environ.get("ALETHEIA_TOKEN")
    if not token:
        sys.exit("Set ALETHEIA_TOKEN to send")
    for start in range(0, len(turns), BATCH):
        status, body = post(args.base, args.debate, token, turns[start:start + BATCH])
        print(f"batch {start // BATCH + 1}: HTTP {status} {body[:300]}")


if __name__ == "__main__":
    main()
