---
description: List PRs of current repo (open by default; pass closed/merged/all)
argument-hint: [open|closed|merged|all] [--author @me] [--limit N]
allowed-tools: Bash(gh pr list:*), Bash(gh repo view:*), Bash(git remote:*)
---

Remote: !`git remote get-url origin`
Repo: !`gh repo view --json nameWithOwner -q .nameWithOwner`

Arguments: $ARGUMENTS

List PRs of this repo with `gh pr list`.
- No args or `open`: `--state open`
- `closed`: `--state closed`
- `merged`: `--state merged`
- `all`: `--state all`
- Pass other flags (`--author`, `--limit`, `--label`) through to `gh`.

Use `--json number,title,author,headRefName,state,updatedAt,url`.
Show a compact table: number, title, author, branch, updated. No extra commentary.
