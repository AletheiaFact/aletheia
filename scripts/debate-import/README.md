# Government plan statements → debate drafts

`plan-to-debate.py` reads the pre-check sheet of the 2026 government plans
(Lula and Flávio Bolsonaro) and appends each quoted statement to the Globo
debate as a **draft** transcript turn. A fact-checker then approves the
drafts in the debate's transcript drafts panel; only approved turns become
public sentences that can be fact-checked.

- Sheet: https://docs.google.com/spreadsheets/d/1ltAEdTl-URICw3WcBOTUSMZhpjwzYBwdCCE5GapIBDA (tab `gid=485802486`, must stay link-readable)
- Debate: https://aletheiafact.org/claim/6adbd57988c1214b039c28e8/debate
- Endpoint: `POST /api/claim/debate/:debateId/append` (fact-checker session or M2M token)

Needs only Python 3 (standard library).

## Run

```bash
# 1. Dry run: prints the turns, sends nothing
python3 scripts/debate-import/plan-to-debate.py

# 2. Send as drafts
ALETHEIA_TOKEN='<token>' python3 scripts/debate-import/plan-to-debate.py --send
```

Options: `--all` also sends rows that paraphrase the plan instead of quoting
it; `--base` points at another environment (e.g. `https://test.aletheiafact.org`,
then also pass that environment's `--debate` id); `--debate` sets the debate id.
The personality ids in the script are production's; change them for another
environment.

## What it sends

- One turn per sheet row, skipping "Omissão do plano" rows (they record what
  a plan leaves out, not a statement) and, without `--all`, paraphrased rows.
- `personality`: Lula or Flávio Bolsonaro (must be a participant of the debate).
- `text`: `[Plano de governo, p. N] <quote>`. The prefix keeps a plan quote
  from reading as something said live in the debate.
- `externalId`: `plano-<row ID>` (e.g. `plano-PF16`). The endpoint skips turns
  whose externalId is already on the debate, so re-running is safe.
- Batches of 50 turns (the endpoint's limit).

The token is read from `ALETHEIA_TOKEN` only; never commit it.
