# Aletheia Remote MCP Server — Design

**Date:** 2026-07-18
**Status:** Approved pending review
**Goal:** Let any MCP client (claude.ai connectors, Claude Code, Cursor) connect to Aletheia, log in as a real user via browser-based OAuth (the "Notion approach"), and perform read/search, fact-checking workflow, and content-creation actions.

## 1. Architecture

A new `server/mcp/` NestJS module exposes an MCP **Streamable HTTP** endpoint at
`POST https://aletheiafact.org/server/mcp` on the existing application — no new
service or infrastructure. The `/server/mcp` path is deliberately outside the
Next.js view-route namespace (page controllers use the optional `:namespace?`
prefix, so a bare `/mcp` could be captured by namespace routing). The MCP route
must be registered so it takes precedence over any catch-all/namespace routes.

Tool handlers call existing NestJS services directly (ClaimService,
PersonalityService, ReviewTaskService, VerificationRequestService, SourceService,
TopicService, SearchService) — no internal HTTP hops. Handlers run under the
authenticated user's identity, so existing CASL abilities keep enforcing
permissions.

Implementation uses `@modelcontextprotocol/sdk` (Streamable HTTP server
transport) mounted in a NestJS controller handling `POST`/`GET`/`DELETE` on
`/server/mcp`.

A thin Claude Code plugin (optional, later) can ship a `.mcp.json` pointing at
the remote URL; `claude mcp add --transport http` also works directly.

## 2. Authentication & login flow (OAuth 2.1 per MCP spec)

1. Unauthenticated request to `/server/mcp` → `401` with `WWW-Authenticate`
   pointing to the Protected Resource Metadata document (RFC 9728) at
   `/.well-known/oauth-protected-resource/server/mcp`, which names the Ory
   Network project as the authorization server.
2. The MCP client discovers Ory's OAuth metadata (RFC 8414), performs
   **Dynamic Client Registration** (RFC 7591), and opens the user's default
   browser: Ory hosted login (existing Kratos identities + Account Experience)
   → consent → redirect back to the client with an authorization code (PKCE).
3. The client exchanges the code for access + refresh tokens and sends
   `Authorization: Bearer <token>` on every MCP request. Refresh is silent.

**Ops prerequisites (Ory Network console, no code):** enable OAuth2, enable
Dynamic Client Registration, use Ory's hosted consent screen.

## 3. Backend auth change: `McpAuthGuard`

Generalizes the logic in `server/auth/m2m.guard.ts`:

- Introspect the bearer token via Hydra (`introspectOAuth2Token`).
- `sub === client_id` → machine token → keep existing behavior
  (`role: integration`, unchanged).
- `sub` = Kratos identity ID → fetch the identity via the Kratos admin API,
  read `traits.user_id`, `traits.role`, `traits.app_affiliation`; verify
  affiliation matches `app_affiliation` config (same rule as `SessionGuard`);
  attach `request.user` shaped exactly like `SessionGuard` does (`_id`, `id`,
  `role`, `status`, `isM2M: false`).
- Introspection + identity lookups cached in-memory ~60s (keyed by token hash)
  to avoid hammering Ory during tool-heavy conversations.
- The `/server/mcp` routes bypass `SessionGuard`'s redirect logic (marked
  public for session purposes; auth enforced by `McpAuthGuard`).

## 4. Tool surface (v1, ~17 tools)

All tool inputs validated with Zod schemas (project convention:
`z.infer<typeof Schema>`), handlers are thin wrappers over existing services.

**Read/search**

| Tool | Backing service |
|---|---|
| `search` | SearchService (Atlas Search) |
| `get_claim`, `list_claims` | ClaimService |
| `get_personality`, `list_personalities` | PersonalityService |
| `get_claim_review` | ClaimReviewService |
| `get_review_task`, `list_review_tasks` | ReviewTaskService |
| `get_verification_request`, `list_verification_requests` | VerificationRequestService |
| `list_topics` | TopicService |
| `list_sources` | SourceService |

**Fact-checking workflow**

- `create_verification_request`
- `add_review_comment`

**Content creation**

- `create_claim` (speech type first)
- `create_personality`
- `create_source`

**Explicitly out of v1:** review-task state transitions (XState workflow has
frontend-coupled semantics; driving it blind from tools is risky), admin/user
management ops. Both can be added later without structural change.

## 5. Error handling

- Invalid/expired token → `401` + `WWW-Authenticate` challenge; clients
  auto-refresh or re-run the login flow.
- Tool-level failures (Zod validation, CASL denial, not-found) → structured
  MCP tool error results with readable messages; never stack traces.
- Introspection/Ory outage → `503`-style MCP error, logged via the existing
  Nest logger.

## 6. Testing

- Unit tests: `McpAuthGuard` — machine token path, user token path,
  affiliation mismatch, inactive token, cache behavior.
- E2E (Vitest, mongodb-memory-server per existing setup): `/server/mcp`
  initialize + tool calls with mocked Hydra introspection and Kratos identity
  lookup.
- Manual: MCP Inspector against local dev; Claude Code
  (`claude mcp add --transport http`) against stage.

## 7. Rollout

1. `/server/mcp` gated behind a config flag (default off).
2. Enable on **stage**, verify end-to-end login + tools with real Ory stage
   project.
3. Enable in production.

## Decisions log

- Remote MCP server ("Notion approach") over local stdio plugin — chosen for
  zero-install, works on claude.ai web/mobile.
- Embedded in the NestJS monolith over a separate service — reuses services,
  guards, deployment.
- Endpoint path `/server/mcp` (not `/mcp`) — avoids collision with
  Next.js/namespace view routes.
- Ory Network is both IdP (Kratos) and OAuth AS (Hydra); hosted login/consent —
  no custom consent app.
- Credential lives in the MCP client (bearer token), not on the server.
