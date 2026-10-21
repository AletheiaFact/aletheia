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

Without `--global` the server is written to the project config only. Flags must
come before the server name.

## Tools

### Read

| Tool                         | Description                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `search`                     | Full-text search across personalities, claim sentences and claim revisions    |
| `search_topics`              | Search topics by name or alias                                                |
| `list_claims`                | List claims, optionally filtered by personality                               |
| `get_claim`                  | Get a claim by id, including its latest revision                              |
| `list_personalities`         | List public figures (personalities)                                           |
| `get_personality`            | Get a personality by id, with claims                                          |
| `list_sources`               | List classified sources (references)                                          |
| `get_claim_review`           | Get a published fact-check review by id or `data_hash`                        |
| `list_review_tasks`          | List review tasks by workflow state (unassigned, assigned, reported, published) |
| `get_review_task`            | Get a review task by id                                                       |
| `list_verification_requests` | List verification requests (fact-check intake)                                |
| `get_verification_request`   | Get a verification request by id                                              |

### Write

| Tool                          | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| `create_claim`                | Create a speech-type claim for a personality                               |
| `create_personality`          | Create a public figure (personality)                                       |
| `create_source`               | Register a source URL, optionally linked to a target                       |
| `start_review_task`           | Claim a claim sentence for fact-checking; the task is created already assigned to you |
| `add_review_comment`          | Add a comment to a review task (by `data_hash`)                            |
| `create_verification_request` | Submit content for fact-checking (enters the triage pipeline)              |

`start_review_task` claims a claim sentence (by `claimId` + sentence
`dataHash`) for fact-checking: it creates the review task already `assigned`
to the caller. In the web app "no task" already means unassigned, so there is
no separate enqueue step.

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
