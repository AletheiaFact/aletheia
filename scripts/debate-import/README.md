# Debate import scripts

Scripts that append turns to the Globo 2026 debate (Lula x Flávio Bolsonaro)
as **draft** transcript turns. A fact-checker then approves the drafts in the
debate's transcript drafts panel; only approved turns become public sentences
that can be fact-checked.

- Debate: https://aletheiafact.org/claim/6adbd57988c1214b039c28e8/debate
- Endpoint: `POST /api/claim/debate/:debateId/append` (fact-checker session or M2M token)
- Needs only Python 3 (standard library). Both sheets must stay link-readable.
- The token is read from `ALETHEIA_TOKEN` only; never commit it.
- The personality ids in the scripts are production's; change them (and
  pass `--base`/`--debate`) for another environment.

Both scripts are dry runs unless given `--send`, send in batches of 50 (the
endpoint's limit) and set an `externalId` on every turn. The endpoint skips
turns whose `externalId` is already on the debate, so re-running is safe.

## `transcript-to-debate.py`: the debate transcript

Source: https://docs.google.com/spreadsheets/d/1x7Mz2_kB-k2-2UAswGevZd3plff2L2cDDu1JGrYtPhs (tab `gid=0`),
the transcription script's output after triage.

| Sheet column | Turn field |
|---|---|
| Candidato (`Lula` / `Flávio`) | `personality` |
| Transcrição | `text` |
| Checabilidade (0–100) | `checkability` |
| Início | `externalId` = `globo2026-<Início>`; `startedAt` with `--recording-start` |
| Status | filter: `Enviado para checagem` is sent, `Ignorado` never, `Novo` only with `--include-new` |

Turns are sent in recording order (by Início).

```bash
python3 scripts/debate-import/transcript-to-debate.py            # dry run
ALETHEIA_TOKEN='<token>' python3 scripts/debate-import/transcript-to-debate.py --send
```

Options: `--include-new`; `--recording-start 2026-10-22T22:00:00Z` (the
datetime of the recording's 00:00:00, used for `startedAt`).

If the transcription pipeline already appended these turns to the debate with
its own externalIds, this script would add them a second time; check the
drafts panel first.

## `plan-to-debate.py`: government plan statements

Source: https://docs.google.com/spreadsheets/d/1ltAEdTl-URICw3WcBOTUSMZhpjwzYBwdCCE5GapIBDA (tab `gid=485802486`),
the pre-check of the government plans.

- One turn per row, skipping "Omissão do plano" rows and, without `--all`,
  rows that paraphrase the plan instead of quoting it.
- `text`: `[Plano de governo, p. N] <quote>`. These were written in the
  plans, not said in the debate; the prefix keeps them from reading as live
  speech.
- `externalId`: `plano-<row ID>` (e.g. `plano-PF16`).

```bash
python3 scripts/debate-import/plan-to-debate.py                  # dry run
ALETHEIA_TOKEN='<token>' python3 scripts/debate-import/plan-to-debate.py --send
```
