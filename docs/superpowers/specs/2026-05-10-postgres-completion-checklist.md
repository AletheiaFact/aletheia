# Postgres Migration — Phased Completion Checklist

**Date:** 2026-05-10
**Companion to:** [`2026-05-10-postgres-foundational-layer-design.md`](./2026-05-10-postgres-foundational-layer-design.md)
**Purpose:** Track the path from "foundational layer + personality slice merged" to "full Postgres parity, MongoDB sunset."

This is a living document. Each phase is a separate workstream with its own spec → plan → implementation cycle (per the brainstorming → writing-plans → executing-plans flow). Phases can be reordered or parallelized when their dependencies allow.

**Effort bands:** S = ≤ 1 dev-week; M = 1–3 dev-weeks; L = 3+ dev-weeks.

---

## Universal per-phase requirements

Every phase that adds a new resource to Postgres MUST ship:

- [ ] `I*Service` interface in `server/interfaces/` capturing the full public surface used by callers.
- [ ] Sibling `<module>/postgres/` directory mirroring `<module>/mongo/`.
- [ ] Drizzle schema file(s) registered in `server/database/postgres/schema/index.ts`.
- [ ] Drizzle-kit migration committed to `migrations-postgres/`.
- [ ] `<module>.service.type-test.ts` enforcing exact-match public surface across both implementations.
- [ ] `<module>.module.ts` and `<module>.provider.ts` extended with a `postgres` branch.
- [ ] Contract tests in `<module>-contract.spec.ts` (CRUD + behavior-equivalent surface).
- [ ] Backend-specific tests: `*.mongo.spec.ts` and `*.postgres.spec.ts` only for genuinely backend-specific behavior.
- [ ] `NotImplementedError`s in earlier phases that this phase unblocks are removed and replaced with real implementations.
- [ ] Updated entry in this checklist marking the phase done.

---

## Phase 0 — Foundational layer + personality slice ✅ scope of current spec

**Effort:** M
**Status:** Pending implementation (this design)
**Modules:** `personality`
**Atlas features mapped:** Atlas `$search` (fuzzy on `name`) → `pg_trgm` GIN index + `%` operator
**Deferred methods (will return HTTP 501 on `DB_TYPE=postgres`):**
- `getClaimsByPersonalitySlug` (unblocked by Phase 2)
- `getReviewStats` (unblocked by Phase 3)
- `combinedListAll` (unblocked by Phase 3)
- `extractClaimWithTextSummary` (unblocked by Phase 2)

**Done when:** Acceptance criteria in the foundational-layer design doc all pass.

---

## Phase 1 — Verification request slice (highest business value)

**Effort:** M
**Modules:** `verification-request`
**Why prioritized:** Largest user-facing AI feature (fact-checking pipeline) and exercises `pgvector`. Validates the foundational layer's vector story.

**Atlas features mapped:**
- Manual cosine similarity via `$zip`/`$reduce` (`verification-request.service.ts:901-951`) → `pgvector` `<=>` operator (`1 - (embedding <=> $1) AS similarity`).
- OpenAI embedding storage (`number[]`) → `vector(N)` column where N is fixed at the dimension of the embedding model in use (`text-embedding-3-small` = 1536). Confirm dimension and pin in schema.
- Sources/group/topics populate chains → explicit Drizzle joins.

**Schemas to add:**
- `verification_request` (with `embedding vector(1536)` + HNSW index)
- Related: `source`, `group`, `topic`, `impact_area` if the join-required subset isn't already covered. Decide per-module whether to defer joins via lazy fetches into Mongo-backed counterparts (no — would re-introduce dual-backend reads; instead, port enough of those tables to satisfy the joins, even if their full service surface remains stubbed).

**Open questions for the Phase 1 spec:**
- Which embedding model is canonical? Confirm dimension.
- HNSW vs IVFFlat index for the pgvector column? Default to HNSW for query latency unless write throughput becomes an issue.
- The state machine logic in `verification-request` lives largely in the service layer — does any of it depend on Mongo-specific query semantics?

**Removes `NotImplementedError` from:** none (these are personality-cross methods, not verification-cross).

---

## Phase 2 — Claim + claim-revision slice

**Effort:** L
**Modules:** `claim`, `claim/claim-revision`, plus claim content types: `claim/types/sentence`, `claim/types/image`, `claim/types/debate`, `claim/types/unattributed`
**Why prioritized after verification-request:** Personality's deferred methods (`getClaimsByPersonalitySlug`, `extractClaimWithTextSummary`) need claims tables present.

**Atlas features mapped:**
- Atlas `$search` on sentence content/topics (`sentence.service.ts:85-108`) → trgm GIN on `content` and `topics`. Note: `topics` is an array — needs `unnest` + trgm or a separate `claim_topic` join table.
- Atlas `$search` on claim revision title (`claim-revision.service.ts:92-101`) → trgm GIN on `title`.
- Heavy `$lookup` chains for sentence search (3-way join: sentences → claimrevisions → claims → personalities) → CTEs or chained Drizzle joins.

**Modeling decisions:**
- Mongo `Claim` is a single collection with a discriminator-by-content-type pattern *in code* (claim has a `contentType` field referencing sentence/image/debate/unattributed). Audit confirmed Mongoose discriminators are NOT used. Postgres modeling: single `claim` table with a `content_type` column + nullable type-specific columns, OR a `claim` parent table + per-type tables joined by `claim_id`. **Recommend single table** unless type-specific column count grows >10.
- `claim-revision` is its own collection — straight port to a `claim_revision` table with `claim_id` foreign key.

**Removes `NotImplementedError` from personality:**
- `getClaimsByPersonalitySlug`
- `extractClaimWithTextSummary`

**Soft delete:** `claim` schema uses `mongoose-softdelete-typescript` — apply the same `is_deleted` + `notDeleted()` pattern.

---

## Phase 3 — Claim-review slice

**Effort:** M
**Modules:** `claim-review`
**Atlas features mapped:** none specific to this module beyond aggregations.

**Aggregations to rewrite:**
- `claim-review.service.ts:169-230` — nested `$lookup` chains (claims → claimrevisions → personalities) + `$unwind`. Becomes a multi-CTE SQL query.
- `claim-review.service.ts:101-112` — `$facet` for status counts. Becomes parallel `count(*) FILTER (WHERE status = ?)` aggregations in a single query.

**Pre-find hooks** for auto-populating sources and reviews (`pre("find")` in the schema) become explicit `with: { sources: true, reviews: true }` Drizzle relational queries.

**Removes `NotImplementedError` from personality:**
- `getReviewStats`
- `combinedListAll`

After Phase 3, the personality slice has zero `NotImplementedError`s on Postgres — full feature parity for that module.

---

## Phase 4 — Users + auth-related collections

**Effort:** M
**Modules:** `users`, `auth/ability` (CASL definitions are code, not data — but stored user roles need porting).

**Notes:**
- Ory Kratos owns identity primitives — most auth state stays in Kratos's own Postgres (already separate from Aletheia's data store).
- The `users` collection in Mongo is mostly profile/role/badge data joined to Kratos identity IDs.
- `pre("find")` hook on `User` schema for badge population.

**Open questions for Phase 4 spec:**
- Are user roles stored in Aletheia's DB or in Kratos identity traits? Confirm before scoping.
- Badges: storage strategy (one row per user-badge or array column?).

---

## Phase 5 — Review-task + comments

**Effort:** M
**Modules:** `review-task`, `review-task/comment`
**Notes:**
- Review tasks have an XState state machine (`src/machines/reviewTask/`). State persistence is in the DB; XState itself is client-side. Schema port is mostly straightforward.
- `comment` is a child entity — straight port with a foreign key.
- Recently merged work (commit `7e8fdc6a`) added unit test coverage for `mergeSources` — that logic is service-layer and DB-agnostic, so it ports without change.

---

## Phase 6 — Source, topic, group, badge, history, state-event, tracking

**Effort:** M (in aggregate; each module is S)
**Modules:** `source`, `topic`, `group`, `badge`, `history`, `state-event`, `tracking`
**Notes:** Smaller modules; mostly straight CRUD with foreign keys to already-ported entities. Bundle into one or two PRs.

**Atlas features mapped:** none. `topic` integrates with Wikidata (external API, no DB change). `history` has `$facet` aggregation (`history.service.ts:114-180`) — rewrite as a single SQL query with conditional joins.

---

## Phase 7 — Aggregation-heavy modules

**Effort:** L
**Modules:** `events`, `stats`, `daily-report`, `verification-request-stats`
**Why grouped:** these contain the most complex `$facet` + `$lookup` pipelines. They benefit from being tackled together so SQL idioms (CTEs, `count(*) FILTER`, materialized views) are reused.

**Aggregations to rewrite:**
- `events/event.service.ts:266-315` — topic metrics with 3× nested `$lookup` + `$facet`. Multi-CTE rewrite.
- `verification-request-stats.service.ts:59-100` — `$facet` with `$group`/`$match`/`$count`. Single query with `FILTER` clauses.
- `daily-report` — likely candidates for materialized views refreshed nightly.
- `stats/` — analytics aggregations, evaluate per-query.

**Risk:** these queries are performance-critical. Add EXPLAIN-based regression checks.

---

## Phase 8 — Auxiliary modules with thin DB layers

**Effort:** M
**Modules:** `notifications`, `copilot`, `summarization`, `automated-fact-checking`, `ai-task`, `chat-bot`, `chat-bot-state`, `file-management`, `editor-parse`
**Notes:**
- Mostly call-out services that orchestrate external APIs (Novu, OpenAI, S3) with thin DB layers.
- `automated-fact-checking` and `copilot` may share embedding infrastructure with `verification-request` (Phase 1) — reuse the `pgvector` patterns.
- `file-management` already uses S3 — only metadata tables need porting.

---

## Phase 9 — Editor + collaborative + yjs-websocket

**Effort:** L (high uncertainty)
**Modules:** `editor`, `editor-parse`, `yjs-websocket`, plus `Collaborative/` frontend coordination
**Why last among the porting work:** real-time + Yjs persistence has the most exotic data shapes (CRDT update logs). Requires per-module evaluation.

**Open questions for the Phase 9 spec:**
- How is Yjs document state persisted today? If as opaque blobs, it's a `bytea` column — easy.
- Does the editor module use Mongo-specific features for change tracking? (Audit said no change streams in use, but verify scope.)
- Is there a hot-path query that benefits from Mongo's document model?

If Yjs persistence proves awkward in Postgres, this phase MAY be the one place hybrid retention (keeping Mongo for Yjs blobs) is justified. Decide during Phase 9 spec, not now.

---

## Phase 10 — Mongo→Postgres data migration tooling

**Effort:** M
**Why now:** by this point all schemas exist in both backends. The migration script can be authored against the final Drizzle schemas without rewriting.
**Constraints:** downtime is acceptable per user (so no dual-write window needed).

**Deliverables:**
- One-shot per-collection migration scripts under `scripts/migrate-to-postgres/`. Each script:
  - Reads from Mongo via the existing Mongoose models.
  - Maps `ObjectId` → UUID deterministically (uuid v5 in a fixed namespace, so cross-references resolve).
  - Writes to Postgres via Drizzle.
  - Idempotent: safe to re-run; uses `INSERT ... ON CONFLICT DO NOTHING` keyed on `(legacy_object_id)` columns added per table for the migration.
- A driver script `yarn migrate:to-postgres` that runs them in dependency order.
- Documentation: pre-flight checks, downtime estimate per collection size, rollback procedure (which is "stop using Postgres and switch `DB_TYPE` back to mongodb" — Mongo data is untouched).

**Schema changes required:** add a nullable `legacy_object_id text` column to every ported table — added at the start of Phase 10 via a new drizzle-kit migration, NOT in earlier phases (Phase 0 personality table does not include it). Dropped after sunset in Phase 11.

---

## Phase 11 — Sunset MongoDB

**Effort:** S
**Preconditions:** Phase 10 complete, all production deployments cut over to Postgres, observation window passed.

**Cleanup:**
- [ ] Remove `mongodb`, `mongoose`, `@nestjs/mongoose`, `mongoose-softdelete-typescript`, `mongodb-memory-server`, `migrate-mongo-ts` from `package.json`.
- [ ] Delete every `<module>/mongo/` directory.
- [ ] Delete `migrations/` and `migrate-mongo-config.ts`.
- [ ] Delete the `cypress-run-ferretdb` CI job and FerretDB services from `docker-compose.yaml`.
- [ ] Collapse `IPersonalityService` (and other resource interfaces) — they're now single-implementation, so the abstraction is no longer paying for itself. Either inline the impls or keep the interfaces as documentation. **Recommend keeping** for testability (mockable by interface).
- [ ] Drop `legacy_object_id` columns added in Phase 10.
- [ ] Remove the `dbConfig.type` switch from `app.module.ts` and per-module `register()` methods.
- [ ] Delete the `*.service.type-test.ts` files for resources that are no longer multi-backend (they'd compile trivially as single-implementation checks).
- [ ] Update CLAUDE.md to remove MongoDB references; replace with Postgres equivalents.

---

## Cross-cutting concerns to track across phases

- [ ] **Connection pooling** — single shared `PostgresModule.forRoot` pool. Watch for pool exhaustion under load as more modules are ported.
- [ ] **Read replicas** — not needed for the personality slice. Reassess at Phase 7 (aggregation-heavy reads).
- [ ] **Backups** — production runbook for `pg_dump` / WAL archiving (deployment-team task, not code).
- [ ] **Observability** — query latency histograms per `IPersonalityService` method via Nest interceptor. Adds visibility before the team commits to Postgres in production.
- [ ] **N+1 protection** — Drizzle's relational queries help, but `.with({...})` deep populates can hide N+1s. Periodic spot-check via SQL logging.
- [ ] **`pg_trgm` similarity threshold** — pinned via config per phase. Test corpora needed to validate quality on real data.
- [ ] **`pgvector` index choice** — HNSW vs IVFFlat decided in Phase 1. Re-evaluate if a later phase has very different query patterns.

---

## When this checklist is "done"

Phase 11 complete: MongoDB removed from the codebase, only Postgres in production, no `dbConfig.type` switch, the foundational layer's `IPersonalityService`-style abstractions either kept (for tests) or collapsed (per-module decision).

This typically takes **6–9 months** at one full-time engineer pace, less with parallelism between Phase 1 (verification-request) and Phase 2 (claim) once the foundational layer is in place. Phases 6–8 are batchable. Phase 9 has the most schedule risk.
