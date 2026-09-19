# Postgres Migration — Foundation

**Date:** 2026-09-18
**Status:** Living document — THE single source of truth for the MongoDB → Postgres migration.
**Supersedes:**
- `docs/superpowers/plans/2026-05-10-postgres-foundational-layer.md` (executed task plan, kept as history)
- `docs/superpowers/plans/2026-05-22-postgres-migration-delivery-strategy.md` (merged here)
- `docs/superpowers/specs/2026-09-18-postgres-architecture-decisions.md` (merged here)

**Companions (still authoritative for their scope):**
- `docs/superpowers/specs/2026-05-10-postgres-completion-checklist.md` — per-phase module scope details
- `docs/superpowers/specs/2026-05-10-postgres-foundational-layer-design.md` — Phase 0 design rationale

> **How to use this document:** each module migration is one MR that follows §4
> (the recipe) and passes §5 (the ship gate). Phase 0 (personality) finishes by
> completing §6. Phase order and dependencies are §7. Delivery/cutover mechanics
> are §8. Testing rules are §9. Do not relitigate §2 decisions — amend with
> evidence instead.

---

## 1. Guiding principles

1. **Every phase is independently shippable and independently revertible.** A phase can sit in production for weeks before the next lands.
2. **`DB_TYPE` is a boot-time switch, never a runtime one.** One process, one backend. No per-request routing, no partial cutover.
3. **Ship the code path dark before you ship the data.** Ported modules reach prod on `DB_TYPE=mongodb` (dormant) long before any deployment flips. Merging ≠ cutting over.
4. **Correctness is proven by equivalence, not by hope.** Contract tests on both backends + (from Phase 1) a data-parity harness on real data.
5. **No silent scope reduction.** A deferred query throws `NotImplementedError` (HTTP 501, structured payload) — never a silent empty result or ignored parameter.
6. **The Mongo implementation is move-only.** Existing Mongo services are never rewritten during the migration — only relocated behind the interface. Zero regression risk on the authoritative backend.

---

## 2. Settled architecture decisions

### D1 — ORM: Drizzle (settled, do not relitigate)

Chosen over Prisma / TypeORM / MikroORM / Kysely / raw `pg` because the migration's hard requirements match it: SQL-level control (partial indexes, `SET LOCAL pg_trgm.similarity_threshold`, GIN/trgm, pgvector), first-class pglite driver + migrator, plain-SQL reviewable migrations, thin DI (one `DRIZZLE` token, no codegen), types inferred from schema.

**Risk control:** `drizzle-orm` and `drizzle-kit` are pinned to exact versions (no `^`) — both are pre-1.0. Upgrades are deliberate, at most one per phase.

### D2 — Pattern: dual services + shared rules module

The swap mechanism is two sibling service implementations behind one interface, selected at boot. A full repository pattern was rejected (forces refactoring live Mongo services; aggregation-heavy modules don't decompose into neutral repo methods).

**But business logic lives once.** Everything that does not touch a database driver goes into a shared rules module both impls import:

```
server/<module>/
  shared/<module>.rules.ts        ← pure functions, no driver imports
  mongo/<module>.service.ts       ← Mongoose queries + shared rules
  postgres/<module>.service.ts    ← Drizzle queries + shared rules
  postgres/schema/<module>.schema.ts
  <module>.provider.ts            ← factory picks impl by dbConfig.type
  <module>-contract.spec.ts       ← same assertions, both backends
  <module>.service.type-test.ts   ← compile-time surface parity
```

**Gate: no business rule may exist in both implementations.** `shared/` constraints: pure functions only; no `this`, no DI; no imports from `mongoose`, `drizzle-orm`, `pg`, or schema files; unit-tested directly, once.

Intentionally duplicated: query construction, transaction orchestration (each backend keeps its native idiom), row→entity mapping (`toEntity` on the Postgres side).

### D3 — FK constraints deferred to the end of the migration

Module ports ship **without** foreign-key constraints. Relational modeling (FKs, ON DELETE policy) happens once, deliberately, alongside Phase 10 backfill — via `ADD CONSTRAINT ... NOT VALID` + `VALIDATE CONSTRAINT` (no long locks, forces explicit orphan cleanup).

Rationale: Mongo has zero referential integrity today (`management/` cascades in app code) — constraint-free PG is *parity*; legacy data has orphans; dual-write needs best-effort PG writes.

**Guardrails (non-negotiable):**
1. Only the *constraint* is deferred — never the column. Every reference lands with its module as a `uuid` column named `<entity>_id`, btree-indexed.
2. Unique constraints are NOT deferred (e.g. `personality_wikidata_uq`) — they're correctness, not relational modeling.
3. An orphan-check sweep (`LEFT JOIN ... WHERE IS NULL` per reference) runs in the parity gate before any cutover.

### D4 — Testing: dual-backend contract tests, ungated

1. **Contract specs register BOTH backends and run unconditionally** — Mongo via mongodb-memory-server, Postgres via pglite, same process, every `yarn test`, every PR. `DB_TYPE` gating is only for wiring-level tests and the full-suite CI matrix, never for contract specs.
2. **No silent skips.** The `vitest-postgres` CI job includes a canary spec failing unless `DB_TYPE === "postgres"`. `DB_TYPE` is removed from `.env` (env-cmd overrides the shell); a `test:pg` script sets it explicitly.
3. **Boot smoke test**: a spec asserts `AppModule` compiles under `DB_TYPE=postgres` — catches DI wiring breaks (a controller still injecting a Mongoose model) per phase.
4. **`expectParity(op)` helper (Phase 1 opener)**: run the same op on both backends, normalize (`_id`/`id`, timestamp precision), deep-diff. Seeds the Phase 1 parity harness.
5. **Real-Postgres CI leg (Phase 1 opener)**: a `postgres:16` service-container job validates what pglite can't — migration SQL on a real server (extension availability, partial indexes, pool semantics).

### Schema conventions (set by Phase 0, every table follows)

- snake_case columns; singular table names; indexes named `<table>_<col>_uq|idx`.
- Soft-delete triple: `is_deleted boolean not null default false`, `deleted_at timestamptz`, partial unique indexes exclude deleted rows (`WHERE ... AND is_deleted = false`).
- `created_at` / `updated_at` `timestamptz not null default now()`.
- `id uuid primary key default gen_random_uuid()`.
- `legacy_object_id text` with partial unique index on every table (nullable; filled by backfill; gives bidirectional Mongo↔PG identity for the parity differ, backfill idempotency, and rollback). *(Pending: add to personality schema before first deploy — free now, ALTER+backfill later.)*
- Tenant-scoped tables get `name_space text not null default 'main'` + composite indexes `(name_space, <lookup-col>)`. Personality is **global** (its Mongo schema has no `nameSpace`) — record per module which applies.
- The `toEntity()` boundary mapper is the only place rows become API entities; it exposes `_id` (Mongo-parity alias the frontend reads) alongside `id`. Never return a raw row cast `as I<Entity>`.

### Error taxonomy (backend-neutral)

All driver errors are mapped to neutral errors in `server/database/errors.ts` at the service boundary; controllers only catch neutral types:
- `NotImplementedError { backend, method }` → HTTP 501 (exists).
- `DuplicateKeyError { fields }` → mapped from Mongo `E11000` and PG `23505`. *(Pending: known live break — `personality.controller.ts` catches `MongoError` by name; dead on Postgres. Two more sites: `verification-request.service.ts`, `event.service.ts` — swept when those modules port.)*
- `NotFoundException` (Nest) for missing entities — both backends.

---

## 3. Foundational layer (built, Phase 0)

| Piece | Where | Role |
|---|---|---|
| Boot switch | `server/config/db.config.ts` + `server/app.module.ts` | `DB_TYPE` env picks Mongoose or `PostgresModule.forRoot()`; mismatch with config.yaml throws at boot |
| Connection | `server/database/postgres/connection.ts` | `pg.Pool` + Drizzle client factory |
| DI | `server/database/postgres/postgres.module.ts` + `postgres.provider.ts` | Global dynamic module exporting the `DRIZZLE` token; pool closed on destroy |
| Schema barrel | `server/database/postgres/schema/index.ts` | One re-export line per ported module |
| Errors | `server/database/errors.ts` + `server/filters/http-exception.filter.ts` | Neutral error types + HTTP mapping |
| Migrations | `drizzle.config.ts`, `migrations-postgres/` | `0000_extensions` (pg_trgm, vector) + one generated migration per module; scripts `migrate:pg`, `migrate:pg:create`, `migrate:pg:status` |
| Test rails | `server/tests/postgres-setup.ts`, `per-worker-setup.ts` | pglite per Vitest worker, migrations on boot, `TRUNCATE` between tests; per-worker Mongo DBs unchanged |
| CI | `.github/workflows/nodejs.yml` | `vitest-postgres` job (full suite under `DB_TYPE=postgres`) |

Migration discipline: never edit an applied migration; drizzle-kit owns `meta/_journal.json`; custom SQL goes through `drizzle-kit generate --custom`.

---

## 4. Per-module porting recipe (one MR per module)

Personality is the template. For module `<m>`:

1. **Extract `I<M>Service`** from the existing Mongo service — full public surface, no trimming. Interfaces are backend-neutral: no `mongoose` or `drizzle-orm` imports; query inputs cross as neutral shapes (each backend translates to `$regex` / `ILIKE` internally).
2. **Move the Mongo impl to `mongo/`** — move-only, byte-equivalent behavior. Wire `<m>.provider.ts` factory + module `postgres` branch.
3. **Extract shared rules** into `shared/<m>.rules.ts` (D2): slug/derivation logic, defaults, input normalization, validation. Both impls import them.
4. **Drizzle schema + migration**: follow §2 schema conventions (soft-delete triple, `legacy_object_id`, reference columns as indexed `uuid` — no FK constraints per D3). Register in the schema barrel. `yarn migrate:pg:create <m>`.
5. **Port methods in small commits** (one commit per method or method-group, TDD against the contract spec). Cross-module methods the dependency phases haven't landed yet throw `NotImplementedError` — loud, tracked in the checklist, removed by the phase that unblocks them.
6. **Map driver errors** to the neutral taxonomy at the service boundary; sweep any backend-specific catches in the module's controllers.
7. **Tests per D4**: dual-backend contract spec (ungated), type-test, postgres-only spec for driver-specific behavior (trgm ranking, etc.).
8. **Merge dark.** Prod stays `DB_TYPE=mongodb`.

## 5. Per-module ship gate (Definition of Done)

- [ ] `I<M>Service` captures the full public surface; interface is Mongo-type-free.
- [ ] `<m>/postgres/` implements it; schema registered in the barrel; migration generated.
- [ ] Schema follows §2 conventions (soft-delete triple, `legacy_object_id`, indexed reference columns, unique indexes partial on `is_deleted = false`).
- [ ] Shared rules extracted — no business rule exists in both impls.
- [ ] Type-test compiles; contract spec green on BOTH backends in one run.
- [ ] CI green under both `DB_TYPE=mongodb` and `DB_TYPE=postgres`.
- [ ] Every deferred method throws `NotImplementedError`; every `NotImplementedError` this phase declared to unblock is removed.
- [ ] No silently ignored parameters (guard unsupported inputs with `NotImplementedError`).
- [ ] Driver-error catches in the module's controllers/services use the neutral taxonomy.
- [ ] Non-CRUD queries: `EXPLAIN (ANALYZE, BUFFERS)` captured, intended index confirmed (no seq-scan on large tables), p50/p95 vs Mongo baseline within 1.5× (from Phase 1 on, with the staging dataset).
- [ ] From Phase 1 on: parity-harness entry added for this module; diff rate 0 on the contract corpus.

---

## 6. Phase 0 completion — status (personality MR)

All completion items landed on 2026-09-18:

1. ✅ Parity fixes committed: `toEntity()` `_id` mapper, `NotFoundException` on missing rows, soft-delete restore on create, slug always derived from name, findOrCreate slug-dedup + wikidata backfill + description template, `SET LOCAL` threshold in transaction, partial unique index excluding soft-deletes.
2. ✅ Merge contamination purged (~208 files restored to stage; PR diff is postgres-only).
3. ✅ Contract suite runs BOTH backends unconditionally (D4.1): Mongo via `server/tests/mongo-contract-setup.ts` (mongodb-memory-server per worker), Postgres via pglite — no `DB_TYPE` gate.
4. ✅ Silent-wrongs fixed: `count` honors `isHidden` + guards unsupported keys; `listAll` treats `pageSize=0` as unlimited (sitemap) and guards `random`/`withSuggestions`/unsupported query keys with `NotImplementedError`.
5. ✅ `shared/personality.rules.ts` (D2): `deriveSlug`, `defaultDescription` — both impls consume; Postgres `update` now re-derives slug on name change (Mongo parity).
6. ✅ `DuplicateKeyError` (HTTP 409) + PG `23505` mapping; controller rethrows it on the Postgres path.
7. ✅ `legacy_object_id` column + partial unique index (migration 0001 regenerated in place).
8. ✅ `LeanDocument` dropped from the interface (`PersonalityRef` neutral type).
9. ✅ Testing hardening (D4.2): `DB_TYPE` removed from local `.env`, `test:pg` script, `db-type-canary.spec.ts` + `CI_EXPECT_DB_TYPE` in the `vitest-postgres` job.
10. ✅ `drizzle-orm@0.36.4` / `drizzle-kit@0.28.1` pinned exactly (D1).
11. ✅ Bonus fix on the Mongo path (documented move-only exception): `create()` without a wikidata id no longer restores an arbitrary soft-deleted row.

**Descoped — boot smoke test (D4.3):** a full-app boot under `DB_TYPE=postgres` is structurally impossible until every module has a postgres branch — each unported module's `@InjectModel` fails without a Mongoose root connection. The `DB_TYPE=postgres` boot switch is therefore *theoretical* until later phases; dark shipping is unaffected (prod runs mongodb). Revisit per phase; add the smoke test once the module graph can boot.

### Known divergences (documented, intentional)

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `getById` on missing/deleted id | resolves `null` (callers then 500) | throws `NotFoundException` (404) | contract normalized as "no usable entity"; PG keeps the better 404 |
| `update` on missing id | upserts (`{upsert: true}`) | throws `NotFoundException` | Mongo upsert looks accidental; not ported |
| `create` without `description` | Mongoose validation error (required) | defaults to `""` | pg-only spec covers it |
| duplicate live wikidata on `create` | error swallowed → 201 empty body | `DuplicateKeyError` → 409 | controller keeps Mongo path; PG surfaces conflict |
| soft-deleted wikidata + `findOrCreatePersonality` | `E11000` (sparse unique index covers deleted rows) | succeeds (partial index excludes deleted) | index semantics; PG behavior is the intended one |
| `listAll` enrichment | rows post-processed (wikidata props + review stats) | raw entities, guarded 501s for unsupported surface | postProcess needs claim/claim-review (Phases 2–3) |
| Mongo impl `listAll` positional args | `(…, query, filter, language, withSuggestions)` — differs from the interface order | interface order | prod behavior left as-is; interface is canonical |

Known deferred-by-design on personality (remove at the phase that unblocks them): `getClaimsByPersonalitySlug`, `postProcess`, `getReviewStats`, `extractClaimWithTextSummary` (Phase 2–3), `combinedListAll` (needs the above), history writes on hide/unhide (history phase). Personality reaches zero 501s only after Phase 3 — the first cutover-eligible milestone.

---

## 7. Roadmap and dependency order

Foreign-key *columns* dictate what must exist before what (constraints come later, D3):

```
✅ Phase 0    Foundation + personality (this MR)
   Phase 0.5  Leaf tables: source/topic/group/badge (schema + basic CRUD)  [S] ← unblocks joins
   Phase 1    verification-request + pgvector + PARITY HARNESS + real-PG CI [M] ← builds cross-cutting tooling
   Phase 2    claim + claim-revision + content types                       [L] → unblocks personality cross-methods
   Phase 3    claim-review                                                 [M] → personality = zero 501s ★ first cutover-eligible
   ── CUTOVER MILESTONE A: deployments using only {personality, claim, claim-review, VR} can flip ──
   Phase 4    users + roles/badges                                         [M]
   Phase 5    review-task + comment                                        [M]
   Phase 6    source/topic/group/badge/history/state-event/tracking (full) [M]
   Phase 7    events/stats/daily-report/vr-stats (aggregations)            [L] ← perf gates critical
   Phase 8    ai-task/copilot/summarization/AFC/chat-bot/files             [M]
   Phase 9    editor/collaborative/yjs (CRDT → bytea)                      [L] ← highest uncertainty
   ── CUTOVER MILESTONE B: full parity — all deployments flippable ──
   Phase 10   migration tooling + backfill + FK constraints (D3 end-game)  [M]
   Phase 11   sunset MongoDB                                               [S]
```

Unplaced modules to audit before Phase 1 finalizes the list: `report` (slot Phase 3 or 6), `management` (cascade logic re-expressed per D3 end-game), `callback-dispatcher` / `chat-bot` / `chat-bot-state` (likely Phase 8), `search` (query-layer only — confirm no standalone collection).

---

## 8. Delivery mechanics (per deployment, decided at cutover time)

**Merging is not cutting over.** A phase merges dark (§5 gate); a deployment flips `DB_TYPE` only when: all modules that deployment uses are past their gate; parity diff rate = 0 on its real data over the observation window; row counts reconciled; perf gates green; rollback rehearsed on a staging clone; runbook exists.

**Strategy A — downtime cutover (default):** freeze writes → export Mongo → run migrations + backfill → verify counts/parity → flip `DB_TYPE=postgres` → smoke → unfreeze. Rollback: flip back, <5 min, Mongo untouched.

**Strategy B — expand/contract zero-downtime (for SLA deployments):** dual-write (Mongo authoritative, PG best-effort) → idempotent backfill → shadow-read with diff logging until diff = 0 → flip authoritative reads → observation window → stop Mongo writes. Rollback at any stage: repoint authoritative to Mongo. The dual-write shim + shadow-read differ are built once in Phase 1 and reused.

**Parity harness (`scripts/parity/`, Phase 1):** offline mode (N records per collection from a Mongo snapshot through both services, deep-diff, in CI + against prod snapshots pre-cutover) and online shadow-read mode. Differ rules codified: deterministic ObjectId↔UUID via `legacy_object_id`; normalize date precision and field order; fuzzy/vector queries compare membership + ranking within a per-query tolerance, never exact scores.

**Perf gates (every non-CRUD port):** committed `EXPLAIN` per query; intended index confirmed; p50/p95 ≤ 1.5× Mongo baseline or explicitly waived; aggregation-heavy modules (Phase 7) evaluate materialized views vs live CTEs per query. pgvector: HNSW default; pin embedding dimension.

---

## 9. Risk register

| Risk | Phase | Mitigation |
|---|---|---|
| Aggregation SQL slower than Atlas | 7 | EXPLAIN gate, materialized views, 1.5× blocker |
| Fuzzy/vector ranking differs from Atlas | 1–2 | tolerance-based parity compare; corpus-validated thresholds |
| Yjs CRDT persistence awkward in PG | 9 | `bytea` blobs first; hybrid-retain Mongo for Yjs only as last resort |
| Cascade-delete semantics lost | 10 | D3 end-game: explicit transactional deletes; orphan sweep |
| Dual-write drift | 1+ | shadow-read diff monitoring; Mongo authoritative until diff = 0 |
| Silent test skips masking coverage | all | D4.2 canary + ungated contract suite |
| Drizzle pre-1.0 API churn | all | exact version pins; one deliberate upgrade per phase max |
| Merge-conflict contamination on long-lived branches | all | verify branch diff vs non-merge-commit file list before every MR |
| Connection-pool exhaustion as modules grow | all | single shared pool + exhaustion metrics |

---

## When this migration is done

Every phase shipped dark and gated (§5), cut over per §8, parity-verified, reversible at each step; FK constraints validated in Phase 10; Phase 11 removes Mongo, the `toEntity` `_id` alias, and the compatibility shims — no big-bang, no unverified cutover, a rehearsed rollback at every milestone.
