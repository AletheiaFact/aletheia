# MCP Security Unification Plan

> Addresses PR #2559 review: MCP created a parallel security path. This unifies MCP
> authentication and authorization onto the platform's existing gateway primitives so
> there is a single security strategy and no drift.

**Goal:** MCP stops carrying its own authn/authz logic and reuses the platform's:
`TokenIdentityService` (shared bearer resolution) for authentication, `AbilityFactory`
(CASL) for write gating, and `NameSpaceService` for namespace membership.

## The three breaches (from review)

1. **Authz hand-rolled & drifting** — `server/mcp/tools/tool-helpers.ts` `WRITE_ROLES` /
   `assertCanWrite` / `resolveUserRole` reimplement (and disagree with) `AbilityFactory`
   (`server/auth/ability/ability.factory.ts`): MCP treats M2M `integration` as create+update
   (CASL grants only Create), and falls back to `role.main` (CASL keys strictly on `role[ns]`).
2. **Namespace membership divergent source** — MCP uses `Object.keys(user.role)`;
   `NameSpaceGuard` (`server/auth/name-space/name-space.guard.ts`) uses the `NameSpace`
   collection's `users[]` via `NameSpaceService`.
3. **Authn duplicated** — `McpAuthGuard` re-implements Hydra introspection, the affiliation
   check, and `request.user` shaping already in `M2MGuard` / `SessionGuard`.

## Target architecture

**`TokenIdentityService`** (new, `@Global` module) — the single bearer/identity gateway:
- `introspect(token)` → Hydra `OAuth2Api.introspectOAuth2Token` (one implementation).
- `isAffiliationValid(traits)` → fail-closed affiliation check (one implementation; also
  hardens `SessionGuard`, superseding the separate fail-open fix).
- `buildIdentityUser(traits, state)` → canonical `{ isM2M:false, _id, id, role, status }`.
- `shapeM2MUser(introspection)` → canonical `{ isM2M:true, clientId, subject, scopes,
  role:{main:"integration"}, namespace:"main" }`.
- `resolveBearerToken(token)` → introspect → M2M shape, or `getIdentity(sub)` →
  affiliation + active-state + `buildIdentityUser`; returns `null` if invalid.

Consumers:
- `M2MGuard` → `resolveBearerToken` (now resolves real user roles for user tokens, not
  just `integration`; client-credential tokens still resolve to `integration`).
- `SessionGuard` → `isAffiliationValid` + `buildIdentityUser` (behavior preserved; spec
  must pass unchanged except for mocking the shared service).
- `McpAuthGuard` → `resolveBearerToken` (keeps its sha256 cache + RFC 9728 `WWW-Authenticate`
  challenge; drops its own introspection/affiliation/shaping and its direct `OryService` dep).

**Authorization (breach 1):** `tool-helpers.ts` `assertCanWrite(abilityFactory, user, ns)` →
`abilityFactory.defineAbility(user, ns).can(Action.Create, "all")`; throw if false. Remove
`WRITE_ROLES` / `resolveUserRole`. `AbilityFactory` injected via `McpToolDeps`.

**Namespace (breach 2):** `assertNamespaceAccess(nameSpaceService, user, ns)` → `main` (or
default) allowed for any authenticated user (matches `NameSpaceGuard` bypassing unscoped
routes); non-main → look up `NameSpaceService.findOne({slug})`, require `user._id` in
`namespace.users`; M2M (no `_id`, `namespace:"main"`) → deny non-main. `NameSpaceService`
injected via `McpToolDeps`. Remove `getAllowedNamespaces`. Keep `assertUserSession` (M2M
`_id` attribution guard — orthogonal to authz).

## Steps (each: TDD, verify, commit; auth steps get adversarial review)

1. **`TokenIdentityService`** + `@Global` `TokenIdentityModule` + unit spec (introspect,
   resolveBearerToken M2M + user, affiliation fail-closed, inactive-state reject, shaping).
2. **`M2MGuard`** → delegate to `resolveBearerToken`. Keep `m2m.guard.spec.ts` green; add
   user-token-resolves-to-real-user coverage.
3. **`SessionGuard`** → use `isAffiliationValid` + `buildIdentityUser`. `session.guard.spec.ts`
   passes unchanged (behavior-preserving) except mocking the shared service.
4. **`McpAuthGuard`** → delegate to `resolveBearerToken`; keep cache + `deny()`. Rewrite its
   spec to mock `TokenIdentityService`; the introspection/affiliation/shaping assertions move
   to the service spec.
5. **Authz** → `tool-helpers` + `McpToolDeps` + `McpService` use `AbilityFactory`. e2e green
   (Regular blocked, admin allowed, M2M integration = create-only per CASL).
6. **Namespace** → `tool-helpers` + `McpToolDeps` + `McpService` use `NameSpaceService`. e2e
   green (cross-namespace reject via DB membership, main allowed).
7. Full `yarn test` + `yarn build-ts` green; push; reply to review thread.

## Risk

Steps 2–3 touch whole-app login. Guard specs and e2e are the safety net — they must pass
with minimal change (only shared-service mocking). Existing M2M client-credential behavior
is preserved; the only additive change is user bearer tokens resolving to real roles.
