# Aletheia MCP Server

Remote [Model Context Protocol](https://modelcontextprotocol.io) endpoint at
`POST /api/mcp` (Streamable HTTP, stateless). Lets MCP clients (claude.ai,
Claude Code, Cursor) authenticate as real Aletheia users via OAuth 2.1 and run
fact-checking tools.

## Enabling

Set in `config.yaml` (or env for deployments):

```yaml
mcp:
  enabled: true            # MCP_ENABLED
  public_url: https://aletheiafact.org   # MCP_PUBLIC_URL
```

## Ory Network setup (one-time, per environment)

1. In the Ory Network console for the project, enable **OAuth2** (Hydra).
2. Enable **Dynamic Client Registration** (Public endpoints → allow
   `POST /oauth2/register`) so MCP clients can self-register.
3. Use the Ory-hosted **login and consent** screens (Account Experience) —
   no custom consent app is required.

## Auth flow

1. Client POSTs to `/api/mcp` → 401 with
   `WWW-Authenticate: Bearer resource_metadata="…/.well-known/oauth-protected-resource/api/mcp"`.
2. Client reads the metadata, discovers Ory as the authorization server,
   registers via DCR, and runs the authorization-code + PKCE flow in the
   user's browser (Kratos login + consent).
3. Client calls `/api/mcp` with `Authorization: Bearer <token>`.
   `McpAuthGuard` introspects the token via Hydra and resolves the Kratos
   identity to the real user and role; CASL abilities apply as usual.

## Connecting from Claude Code

```bash
claude mcp add --transport http aletheia https://aletheiafact.org/api/mcp
```

From claude.ai: Settings → Connectors → Add custom connector →
`https://aletheiafact.org/api/mcp`.

## Tools

Read: `search`, `list_claims`, `get_claim`, `list_personalities`,
`get_personality`, `get_claim_review`, `list_review_tasks`, `get_review_task`,
`list_verification_requests`, `get_verification_request`, `search_topics`,
`list_sources`.
Write: `create_verification_request`, `add_review_comment`, `create_claim`,
`create_personality`, `create_source`.

Tool inputs are Zod-validated (`server/mcp/tools/schemas.ts`). Adding a tool =
schema in `schemas.ts` + registration in `read-tools.ts`/`write-tools.ts`.
