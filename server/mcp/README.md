# Aletheia MCP Server

Remote [Model Context Protocol](https://modelcontextprotocol.io) endpoint at
`POST /api/mcp` (Streamable HTTP, stateless). Lets MCP clients (claude.ai,
Claude Code, Codex, Antigravity, OpenCode, Cursor) authenticate as real
Aletheia users via OAuth 2.1 and run fact-checking tools.

## Setup

### Enabling

Set in `config.yaml` (or env for deployments):

```yaml
mcp:
  enabled: true            # MCP_ENABLED
  public_url: https://aletheiafact.org   # MCP_PUBLIC_URL
```

For a deployed environment, set `mcp` in that environment's pkl file under
`deployment/config/config-file/`. CI renders the file into `config.yaml` on
each deploy. A value set in the pkl file wins over the `MCP_ENABLED` and
`MCP_PUBLIC_URL` defaults that `modules/service/confBase.pkl` reads.

| Environment | pkl file | Branch | `mcp.enabled` | `mcp.public_url` |
| --- | --- | --- | --- | --- |
| test | `development.pkl` | `stage` | `true` | `https://test.aletheiafact.org` |
| production | `production.pkl` | `master` | not set (off) | — |

The setting in `development.pkl`:

```pkl
mcp = new {
    enabled = true
    public_url = "https://test.\(appBaseUrl)"
}
```

Set `public_url` to the environment's own origin. Clients use it to find the
protected-resource metadata and the authorization server.

### Ory Network (one-time, per environment)

1. In the Ory Network console for the project, enable **OAuth2** (Hydra).
2. Enable **Dynamic Client Registration** (Public endpoints → allow
   `POST /oauth2/register`) so MCP clients can self-register. Aletheia proxies
   this endpoint (see Auth flow); clients never call Ory's directly.
3. Use the Ory-hosted **login and consent** screens (Account Experience) —
   no custom consent app is required.

### Local development

Hydra must be running (`:4444` public, `:4445` admin) before a client can
authenticate. The `.vscode/tasks.sh` setup starts it with the other services.
Replace `https://aletheiafact.org` with `http://localhost:3000` in the commands
below.

## Auth flow

1. Client POSTs to `/api/mcp` → 401 with
   `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource/api/mcp"`.
2. Client reads the metadata, which names Aletheia itself as the
   authorization server. It fetches `/.well-known/oauth-authorization-server`
   (Ory's metadata with `issuer` and `registration_endpoint` overridden),
   registers via DCR at `POST /api/mcp/register`, and runs the
   authorization-code + PKCE flow in the user's browser (Kratos login +
   consent).

   The registration endpoint is a thin proxy to Ory's `/oauth2/register`
   (`McpOAuthProxyService`). Hydra returns unset fields as `null`/`""`
   (`contacts: null`, `client_uri: ""`), which strict MCP clients reject, so
   the proxy strips them. Authorize and token requests go straight to Ory.
3. Client calls `/api/mcp` with `Authorization: Bearer <token>`.
   `McpAuthGuard` introspects the token via Hydra and resolves the Kratos
   identity to the real user and role; CASL abilities apply as usual.

## Install on Harness

Every harness below needs the same endpoint, `https://aletheiafact.org/api/mcp`,
and an OAuth login after adding it.

### Claude Code

```bash
claude mcp add --transport http aletheia https://aletheiafact.org/api/mcp
claude mcp login aletheia
```

Pass `--no-browser` to `login` to print the authorization URL instead (SSH or
headless sessions). Alternatively, run `/mcp` inside Claude Code, select
`aletheia`, and authenticate.

From claude.ai: Settings → Connectors → Add custom connector →
`https://aletheiafact.org/api/mcp`.

### Codex

```bash
codex mcp add aletheia --url https://aletheiafact.org/api/mcp
codex mcp login aletheia
```

### Antigravity CLI

```bash
agy mcp add aletheia https://aletheiafact.org/api/mcp
agy mcp list
```

`http`/`https` URLs are detected automatically; pass `--type http` to force it.
Flags such as `--header` must come before the server name.

### OpenCode

```bash
opencode mcp add --global aletheia --url https://aletheiafact.org/api/mcp
opencode mcp auth aletheia
opencode mcp list
```

Without `--global` the server is written to the project config only. Flags must come before the server name.

## Tools

Tools are grouped by subject. **Access** is `read` for lookups and `write` for
tools that create or change data.

### Search

| Tool            | Access | Description                                                                |
| --------------- | ------ | -------------------------------------------------------------------------- |
| `search`        | read   | Full-text search across personalities, claim sentences and claim revisions |
| `search_topics` | read   | Search topics by name or alias                                             |

### Claims

| Tool           | Access | Description                                      |
| -------------- | ------ | ------------------------------------------------ |
| `list_claims`  | read   | List claims, optionally filtered by personality  |
| `get_claim`    | read   | Get a claim by id, including its latest revision |
| `create_claim` | write  | Create a speech-type claim for a personality     |

### Personalities

| Tool                 | Access | Description                          |
| -------------------- | ------ | ------------------------------------ |
| `list_personalities` | read   | List public figures (personalities)  |
| `get_personality`    | read   | Get a personality by id, with claims |
| `create_personality` | write  | Create a public figure (personality) |

### Sources

| Tool            | Access | Description                                          |
| --------------- | ------ | ---------------------------------------------------- |
| `list_sources`  | read   | List classified sources (references)                 |
| `create_source` | write  | Register a source URL, optionally linked to a target |

### Reviews

| Tool                 | Access | Description                                                                     |
| -------------------- | ------ | ------------------------------------------------------------------------------- |
| `get_claim_review`   | read   | Get a published fact-check review by id or `data_hash`                          |
| `list_review_tasks`  | read   | List review tasks by workflow state (unassigned, assigned, reported, published) |
| `get_review_task`    | read   | Get a review task by id                                                         |
| `add_review_comment` | write  | Add a comment to a review task (by `data_hash`)                                 |
| `list_classification_methodologies` | read | List classification methodologies and their labels                    |

#### Classification methodologies

A review stores one of the 9 `ClassificationEnum` keys. Its methodology
(`aletheia` by default, or `rncd-debate`) decides which keys were offered
and how they are worded. `list_classification_methodologies` returns each
methodology's options and labels.

- **Reading.** Every tool that returns classified data adds
  `classificationMethodology`, `methodologyName` and `classificationLabel`
  (`{ pt, en }`) next to each `classification`. This covers `get_claim`,
  `list_claims`, `search`, `list_sources`, `get_claim_review`,
  `get_review_task`, `list_review_tasks` and `get_review_log`, plus the task
  view, review form, claim context and published review the queue and
  workflow tools return. Report the label together with its methodology.
  Review stats on personalities (`{ _id, count }`) combine every
  methodology, so, as on the web, they get the aletheia wording and
  `labelMethodology: "aletheia"`. The blind view `claim_cross_check` returns
  keeps the methodology (the cross-check label must be one of its options)
  but drops the writer's `classification` and `classificationLabel`.
- **Starting work.** `start_review_task` and `next_review_task` take an
  optional `classificationMethodology` (default `aletheia`). It is set when
  work starts, in the same atomic update that assigns the task, and is fixed
  from then on; a released task keeps it. `start_review_task` refuses a task
  that already has another methodology; `next_review_task` only hands out
  tasks with none yet, or with the requested one. A non-default methodology
  requires the `enable_classification_methodology` flag.
- **Writing, cross-checking, publishing.** `save_review_log`,
  `submit_report`, `submit_cross_check` and `publish_review_task` refuse a
  classification the task's methodology does not offer (the web form and
  publish apply the same rule). Publishing copies the methodology to the
  report.

### Fact-checking workflow

A task moves through the same states as in the web app, so either side can
continue it. Each step is a guarded atomic update: a caller acting on a stale
view gets a conflict, never someone else's task.

| Step | Tool | Access | Who | State change |
| --- | --- | --- | --- | --- |
| Take work | `next_review_task` | write | any checker | `unassigned` → `assigned` (returns the claim context) |
| Take a given sentence | `start_review_task` | write | any checker | (none or `unassigned`) → `assigned` |
| Join | `join_review_task` | write | any checker | adds an assignee |
| Read the form | `get_review_log` | read | anyone | — |
| Write the form | `save_review_log` | write | assignee | `assigned` (draft) |
| Finish the report | `submit_report` | write | assignee | `assigned` → `reported` (→ `selectCrossChecker` with `sendToCrossCheck: true`) |
| Give back | `release_review_task` | write | assignee | `assigned` → `unassigned` |
| Ask for a cross-check | `send_to_cross_check` | write | assignee | `reported` → `selectCrossChecker` |
| Take a cross-check | `claim_cross_check` | write | not an assignee | → `cross-checking` (returns the claim context, not the writer's label) |
| My cross-checks | `next_cross_checking` | read | cross-checker | — |
| Record the cross-check | `submit_cross_check` | write | cross-checker | same label → `selectReviewer` (or `reported` when `auto_send_to_review` is false); different → `assigned` |
| Ask for review | `send_to_review` | write | assignee | `reported` → `selectReviewer` (only when `auto_send_to_review` is false) |
| Take a review | `claim_review_task` | write | reviewer, not assignee or cross-checker | → `submitted` (returns the claim context and the review form) |
| My reviews | `list_my_review_tasks` | read | reviewer | — |
| Send back | `reject_review_task` | write | reviewer | `submitted` → `assigned` |
| Publish | `publish_review_task` | write | reviewer | `submitted` → `published` (returns the ClaimReview) |

`save_review_log` takes the form in plain text — `summary` ("Resumo da
conclusão"), `questions`, `report` ("Relatório da verificação"),
`verification` ("Como verificamos?"), `classification` and `sources`
(`{ href, field, quotedText }`, where `quotedText` is copied from the field
and becomes the link) — and stores the same fields, editor document and HTML
the web form saves. `submit_report` and `publish_review_task` apply the web's
completeness rules and list what is missing.

Rules (`mcp.task_queue` in `config.yaml`):

- `max_assignees` (default 10): limit for `join_review_task`.

The four-eyes rule is enforced by account: a cross-checker is never an
assignee, and a reviewer is never an assignee or the cross-checker. An agent
doing the whole flow therefore needs three accounts (two checkers and one
with the reviewer role). The `aletheia-fact-check` skill
(`.claude/skills/aletheia-fact-check/`) drives the flow following the
*Manual de Checagem*.

### Verification requests

| Tool                          | Access | Description                                                   |
| ----------------------------- | ------ | ------------------------------------------------------------- |
| `list_verification_requests`  | read   | List verification requests (fact-check intake)                |
| `get_verification_request`    | read   | Get a verification request by id                              |
| `create_verification_request` | write  | Submit content for fact-checking (enters the triage pipeline) |

## Development

### Adding a tool

Tool inputs are Zod-validated (`server/mcp/tools/schemas.ts`). Adding a tool =
schema in `schemas.ts` + registration in the matching domain module under
`server/mcp/tools/`:

- Read: `read-content-tools.ts`, `read-review-tools.ts`,
  `read-search-tools.ts`, `read-verification-tools.ts`
- Write: `write-content-tools.ts`, `write-review-tools.ts`,
  `write-verification-tools.ts`

`read-tools.ts` and `write-tools.ts` only aggregate these modules.
