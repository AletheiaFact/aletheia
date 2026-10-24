#!/usr/bin/env python3
"""Append the triaged debate transcript (Globo 2026, Lula x Flávio Bolsonaro)
to the Aletheia debate as draft transcript turns.

The sheet is the transcription script's output after triage: one row per
turn with its timestamps, speaker, text, checkability score and a status.
Only rows whose status is "Enviado para checagem" are sent by default;
"Ignorado" rows are never sent, "Novo" rows only with --include-new.

Dry run by default: prints the turns it would send. With --send it POSTs them
to /api/claim/debate/<debateId>/append, authenticated as a person with your
browser session cookie (ALETHEIA_COOKIE, the `ory_session_...=...` cookie of a
fact-checker logged in on the site) or with a bearer token (ALETHEIA_TOKEN,
e.g. an M2M token). The turns arrive as drafts; a person approves them in the
debate's transcript drafts panel.

Usage:
  python3 transcript-to-debate.py                 # dry run, prints the turns
  ALETHEIA_COOKIE='ory_session_...=...' python3 transcript-to-debate.py --send --limit 1
  ALETHEIA_TOKEN=... python3 transcript-to-debate.py --send
Options:
  --limit N           only the first N turns (e.g. --limit 1 to test one row)
  --include-new       also send rows with status "Novo" (not triaged yet)
  --recording-start   ISO datetime of the recording's 00:00:00, to send each
                      turn's startedAt (e.g. 2026-10-22T22:00:00Z)
  --base URL          default https://aletheiafact.org
  --debate ID         debate content id (the claim's contentId, not the claim
                      id); default 6adbd57988c1214b039c28ea
"""
import argparse
import csv
import io
import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta

SHEET_CSV = (
    "https://docs.google.com/spreadsheets/d/"
    "1x7Mz2_kB-k2-2UAswGevZd3plff2L2cDDu1JGrYtPhs/export?format=csv&gid=0"
)
# Production personality ids of the debate's two participants.
PERSONALITIES = {
    "Lula": "635c52f4e7d6d50033a2b7c4",
    "Flávio": "690b77bc5e479400231a57ae",
}
SENT = "Enviado para checagem"
NEW = "Novo"
BATCH = 50  # DEBATE_TRANSCRIPT_MAX_TURNS
EXTERNAL_ID_PREFIX = "globo2026"


def load_rows():
    with urllib.request.urlopen(SHEET_CSV) as response:
        text = response.read().decode("utf-8")
    rows = list(csv.reader(io.StringIO(text)))
    # The header row is the one that names the columns; rows above it are
    # blank or group titles ("Minutagem", "Checagem", ...).
    header_index = next(i for i, row in enumerate(rows) if "Transcrição" in row)
    header = rows[header_index]
    return [
        dict(zip(header, row))
        for row in rows[header_index + 1:]
        if len(row) >= len(header) and row[header.index("Candidato")] in PERSONALITIES
    ]


def offset(timestamp):
    hours, minutes, seconds = (int(part) for part in timestamp.split(":"))
    return timedelta(hours=hours, minutes=minutes, seconds=seconds)


def to_turn(row, recording_start):
    turn = {
        "personality": PERSONALITIES[row["Candidato"]],
        "text": row["Transcrição"].strip(),
        # The start time identifies the turn in the recording, so re-running
        # the script (or a later version of the sheet) never duplicates it.
        "externalId": f"{EXTERNAL_ID_PREFIX}-{row['Início']}",
    }
    score = row["Checabilidade"].strip()
    if score.isdigit() and 0 <= int(score) <= 100:
        turn["checkability"] = int(score)
    if recording_start:
        started = recording_start + offset(row["Início"])
        turn["startedAt"] = started.isoformat().replace("+00:00", "Z")
    return turn


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
    parser.add_argument("--include-new", action="store_true")
    parser.add_argument("--recording-start")
    parser.add_argument("--base", default="https://aletheiafact.org")
    # The endpoint takes the debate content id (claim.contentId), not the
    # claim id: claim 6adbd57988c1214b039c28e8 has content 6adbd57988c1214b039c28ea.
    parser.add_argument("--debate", default="6adbd57988c1214b039c28ea")
    args = parser.parse_args()

    recording_start = (
        datetime.fromisoformat(args.recording_start.replace("Z", "+00:00"))
        if args.recording_start
        else None
    )
    statuses = {SENT, NEW} if args.include_new else {SENT}
    rows = load_rows()
    selected = sorted(
        (r for r in rows if r["Status"].strip() in statuses and r["Transcrição"].strip()),
        key=lambda r: offset(r["Início"]),
    )
    turns = [to_turn(r, recording_start) for r in selected]
    if args.limit is not None:
        turns = turns[: args.limit]
        selected = selected[: args.limit]
    print(
        f"{len(rows)} rows, sending {len(turns)} "
        f"({sum(r['Candidato'] == 'Lula' for r in selected)} Lula, "
        f"{sum(r['Candidato'] == 'Flávio' for r in selected)} Flávio); "
        f"statuses: {', '.join(sorted(statuses))}",
        file=sys.stderr,
    )

    if not args.send:
        print(json.dumps(turns, ensure_ascii=False, indent=2))
        return
    headers = auth_headers()
    for start in range(0, len(turns), BATCH):
        status, body = post(args.base, args.debate, headers, turns[start:start + BATCH])
        print(f"batch {start // BATCH + 1}: HTTP {status} {body[:300]}")


if __name__ == "__main__":
    main()
