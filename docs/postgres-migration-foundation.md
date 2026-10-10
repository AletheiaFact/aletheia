# Postgres Migration — Foundation

**Date:** 2026-09-18
**Status:** Living document — THE single source of truth for the MongoDB → Postgres migration.
**Supersedes (deleted from the repo; recoverable from git history):**
- `docs/superpowers/plans/2026-05-10-postgres-foundational-layer.md` (Phase 0 task plan, fully executed)
- `docs/superpowers/plans/2026-05-22-postgres-migration-delivery-strategy.md` (merged here)
- `docs/superpowers/specs/2026-09-18-postgres-architecture-decisions.md` (merged here)
- `docs/superpowers/specs/2026-05-10-postgres-completion-checklist.md` (per-phase detail merged into §7)
- `docs/superpowers/specs/2026-05-10-postgres-foundational-layer-design.md` (Phase 0 design, implemented; unique bits merged into §3/§8)

> **How to use this document:** each module migration is one MR that follows §4
> (the recipe) and passes §5 (the ship gate). Phase status and per-phase porting
> notes are §7. Delivery/cutover mechanics are §8. Testing rules are §9. Do not
> relitigate §2 decisions — amend with evidence instead. The
> `pg-migrate-module` skill (`.claude/skills/pg-migrate-module/`) drives a
> module port end-to-end against this document.

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
- `legacy_object_id text` with partial unique index on every table (nullable; filled by backfill; gives bidirectional Mongo↔PG identity for the parity differ, backfill idempotency, and rollback). *(Done for personality: `personality_legacy_object_id_uq` partial unique index in migration 0001.)*
- Tenant-scoped tables get `name_space text not null default 'main'` + composite indexes `(name_space, <lookup-col>)`. Personality is **global** (its Mongo schema has no `nameSpace`) — record per module which applies.
- The `toEntity()` boundary mapper is the only place rows become API entities; it exposes `_id` (Mongo-parity alias the frontend reads) alongside `id`. Never return a raw row cast `as I<Entity>`.

### Error taxonomy (backend-neutral)

All driver errors are mapped to neutral errors in `server/database/errors.ts` at the service boundary; controllers only catch neutral types:
- `NotImplementedError { backend, method }` → HTTP 501 (exists).
- `DuplicateKeyError { fields }` → mapped from PG `23505` at the postgres-service boundary (`rethrowMapped`). Design intent covers Mongo `E11000` too, but Mongo impls are move-only and still throw raw driver errors — mapping lands per module as each ports. Personality's controller already rethrows `DuplicateKeyError` before its Mongo swallow path. *(Pending sweeps: driver-specific catches in `verification-request.service.ts` and `event.service.ts` — swept when those modules port.)*
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
| Test rails | `server/tests/postgres-setup.ts`, `per-worker-setup.ts` | pglite per Vitest worker, migrations on boot, `TRUNCATE` between tests; per-worker Mongo DBs unchanged. `TEST_POSTGRES_URL` switches the same rail to a real server |
| CI | `.github/workflows/nodejs.yml` | `vitest-postgres` job (unit suite under `DB_TYPE=postgres`, pglite) + `vitest-postgres-real` (D4.5: `pgvector/pgvector:pg16` service container, `yarn migrate:pg` then the unit suite with `TEST_POSTGRES_URL`); e2e stays Mongo-only until the boot descope lifts, §6 |
| Parity (D4.4) | `scripts/parity/normalize.ts`, `server/tests/parity.ts`, `yarn parity:diff` | `normalizeForParity` (ids → `<id:n>`, dates → `<date>`, bookkeeping keys dropped, empties collapsed) + `diffNormalized`; `ParityRecorder` records the same op per backend inside a contract suite and asserts in `afterAll`; the CLI diffs two JSON dumps offline |
| Latency/error samples | `server/database/db-metrics.ts` | `DB_METRICS=1` wraps every `createDbServiceProvider` service in a Proxy that logs `{token, backend, method, ms, error}` per call — input for the per-method p50/p95 gate |
| Module wiring | `<module>.module.ts` | `register()` dynamic modules by default. **Nest 9 cannot `forwardRef` a dynamic module from another dynamic module** (`compiler.extractMetadata` unwraps the forwardRef without checking for a `DynamicModule`, so the `{ module, providers… }` object becomes the module's metatype and boot dies with "metatype is not a constructor"). A module that sits in a `forwardRef` cycle (report, sentence) therefore stays a static `@Module` with the `dbConfig.type` branch inline in the decorator; a static module may still `forwardRef(() => X.register())`. `createDbServiceProvider` throws at wiring time when an implementation class is `undefined` (import cycle) |

Migration discipline: never edit an applied migration; drizzle-kit owns `meta/_journal.json`; custom SQL goes through `drizzle-kit generate --custom`. Operationally, migrations are NOT run at boot — operators run `yarn migrate:pg` as a deployment step (mirrors the migrate-mongo model); tests run them automatically on first pglite use per worker.

---

## 4. Per-module porting recipe (one MR per module)

Personality is the template. For module `<m>`:

1. **Extract `I<M>Service`** from the existing Mongo service — full public surface, no trimming. Interfaces are backend-neutral: no `mongoose` or `drizzle-orm` imports; query inputs cross as neutral shapes (each backend translates to `$regex` / `ILIKE` internally).
2. **Move the Mongo impl to `mongo/`** — move-only, byte-equivalent behavior. Wire `<m>.provider.ts` factory + module `postgres` branch.
3. **Extract shared rules** into `shared/<m>.rules.ts` (D2): slug/derivation logic, defaults, input normalization, validation. Both impls import them.
4. **Drizzle schema + migration**: follow §2 schema conventions (soft-delete triple, `legacy_object_id`, reference columns as indexed `uuid` — no FK constraints per D3). Register in the schema barrel. `yarn migrate:pg:create --name=<module>` (drizzle-kit takes `--name=`, not a positional arg).
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
| role-based hidden filtering on `getById`/`getPersonalityBySlug` | non-admin requests get `isHidden: false` injected via `util.getParamsBasedOnUserRole` (REQUEST-scoped) | returns hidden personalities to everyone (service is not REQUEST-scoped) | port role-aware querying when a phase needs PG serving public traffic — before Cutover Milestone A. `findAll`/`count` exclude hidden by default; `listAll` honors the caller-supplied `isHidden` filter |
| duplicate wikidata on `update` | raw `E11000` → 500 | `DuplicateKeyError` → 409 | PG maps at the boundary; Mongo move-only |
| `hideOrUnhidePersonality` return value | pre-update doc (`findByIdAndUpdate` without `new: true`) | updated row | callers ignore the body; PG returns the saner value |

**Source module (Phase 0.5) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `getById` on missing id | resolves `null` | throws `NotFoundException` (404) | same normalization as personality |
| `create` without `user` | fabricates a random ObjectId (`new Types.ObjectId(undefined)`) — accidental | stores `NULL` | fabricated ids are noise; PG keeps honest nulls |
| `props.date` storage | BSON `Date` | jsonb ISO-8601 string | jsonb has no date type; `listAllDailySourceReviews` casts with `::timestamptz` |
| list ordering (`sort({_id})`) | ObjectId order (embeds creation time) | `created_at` (+ `id` tiebreak) | equivalent semantics: insertion order |
| duplicate `data_hash` insert race | raw `E11000` → 500 (dedup pre-check normally prevents it) | `DuplicateKeyError` → 409 | PG maps at the boundary; Mongo move-only |
| `find(match)` | queries a literal `match` field (broken, zero callers) | throws `NotImplementedError` | dead code kept on the interface for surface parity |
| non-uuid ids (`getById`/`updateTargetId`/`getByTargetId`) | invalid ObjectId → CastError 500 | invalid uuid → 22P02 → 500 | parity today; Phase 10 may add a 22P02→404 mapping |
| `create` validation order | coerces `targetId`/`props.date` BEFORE validating href (invalid targetId → BsonError 500 even with a bad href); also mutates the caller's `data` object | validates href first (400), never mutates the input | PG order is saner; live callers unaffected |
| `update` with `data_hash` in the body | applied (rewrites the dedup key) | `NotImplementedError` (501) | rewriting the dedup key via update is unsupported; loud per §1.5 |

Source reference columns land per D3 without constraints: `user_id uuid` (users port in Phase 4) and polymorphic `target_ids uuid[]` (Claim/ClaimReview, GIN-indexed — Mongo dynamic ref has no single entity). The source Mongo schema has **no soft-delete plugin and no delete method**; the PG table still carries the §2 triple for uniformity (always false/null). `listAllDailySourceReviews` and `count` support exactly the live callers' query shapes (`nameSpace`, `props.date.$gt`) and guard everything else with `NotImplementedError`.

**Topic module (Phase 0.5) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `searchTopics` query semantics | unescaped `$regex` (`.`/`*` are metacharacters; sort by `name` in byte order) | literal `ILIKE '%q%'` substring on `name` or any alias; sort by `name` in collation order | regex syntax differs between engines and the input was never escaped; literal match is what callers mean |
| `create` with duplicate entries in one batch | `Promise.all` races into `E11000` → 500 | sequential loop; the second entry finds the first and returns its ref | deterministic; Mongo behavior is a race, not a rule |
| `create` with a `{ slug }` reference to a missing topic | `name` is an object → Mongoose CastError → 500 | `BadRequestException` (400) | there is no usable name; 400 is the honest code |
| `create` with `contentModel = Image` | attaches topics to the image | `NotImplementedError` (501) | image table ports in Phase 2 MR 2; any other `contentModel` attaches to the sentence through the `"SentenceService"` token (Phase 2 MR 1) |
| `findByNames([])` | `$or: []` is a driver error → 500 | `[]` | live callers guard the empty case; empty result is the honest answer |
| `findByWikidataIds` with non-string ids | forwarded to `$in` as-is | non-strings dropped before the query | only real ids can match a text column |
| slug collision on insert (race) | raw `E11000` → 500 | `DuplicateKeyError` → 409 | PG maps at the boundary; Mongo move-only |
| `wikidataId` absent | field missing on the document | `NULL` column, surfaced as `undefined` by `toEntity` | same observable value for callers |

Topic is **global** (no `nameSpace` on the Mongo schema). Its Mongo schema has **no soft-delete plugin and no delete method**; the PG table carries the §2 triple for uniformity (always false/null). `getBySlug` keeps Mongo's `null` on a miss (the `create` loop depends on it) — no 404 normalization here. The `events` module (Mongo until Phase 7) casts `findOrCreateTopic` results back to `TopicDocument`; drop the casts when events ports.

**Badge module (Phase 0.5) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `listAll` | `$lookup` users (holders) + images, image unwound | `NotImplementedError` (501) | users table ports in Phase 4, image in Phase 2; returning rows without the lookups would silently drop data |
| invalid `image._id` on create/update | `new Types.ObjectId(x)` → BSONError 500 | non-uuid → 22P02 → 500 | parity today; Phase 10 may add a 22P02→400 mapping |
| unknown body keys reaching the service (`created_at`, `users`) | dropped by the strict Mongoose schema | never selected into the insert/update | same observable result |
| `getById` / `update` on missing id | `null` | `null` | kept (controller 404s on `update`); no normalization |

Badge is **global** (no `nameSpace`), has **no soft-delete plugin and no delete method**; the PG table carries the §2 triple for uniformity. `image_id uuid` lands per D3 without a constraint, btree-indexed. No `shared/badge.rules.ts`: the module has no driver-free business rule (ids pass through, no derivation). The badge controller still wraps ids in `Types.ObjectId` for the Mongo-only `users` service and `imageService` — Phase 4 / Phase 2 remove those. Pre-existing controller bug left as-is: `updateBadge` returns `undefined` (the `return` sits inside a `forEach`); the frontend ignores the body.

**Group module (Phase 1) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| table name | collection `groups` | `content_group` | `group` is a reserved word; documented exception to the singular-entity rule |
| `getByContentId` populate | `pre("find")` populates `content` (VR docs, each with its `source` populated by the VR `pre("find")`) and `targetId` (Claim) | `content` populated from `verification_request` through the shared `toVerificationRequestEntity` mapper (source ids, not documents); `targetId` stays an id | claim table ports in Phase 2; the VR source populate is explicit on PG and not applied here |
| `target_id` column type | Claim `ObjectId` | `uuid` | closed by Phase 2 MR 1: `PostgresClaimService.create` passes its uuid |
| `removeContent` on the last member | `deleteOne` result `{ deletedCount, acknowledged }` | `{ deletedCount }` | callers read nothing from it |

**Verification-request module (Phase 1) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `findSimilarRequests` | `$zip`/`$reduce` dot product; mismatched dimensions are silently truncated by `$zip` | `-(embedding <#> $1)` (pgvector inner product = the same dot product, threshold 0.8 kept); a dimension mismatch is a loud SQL error | same score for same-length vectors; the Mongo truncation hides a misconfigured embedding model |
| `embedding` column | `number[]` of any length | dimensionless `vector` (no typmod), exact scan | the worker's `DEFAULT_EMBEDDING_MODEL` (`nomic-embed-text`, 768) and the doc's earlier 1536 assumption disagree; the dimension is deployment config, so the typmod + HNSW index land at cutover once the model is pinned |
| `Map` fields (`stateRetries`, `stateFingerprints`, `pendingAiTasks`) | Mongoose `Map` on documents | jsonb → plain objects | JSON-identical on the wire; in-process readers use key access |
| timestamps inside jsonb arrays (`stateErrors`, `stateTransitions`, `auditLog`) | BSON `Date` | ISO-8601 strings | jsonb has no date type |
| `updateVerificationRequestWithTopics` return value | pre-update document (`findByIdAndUpdate` without `new: true`) | updated entity | callers ignore the body; PG returns the saner value |
| `update` with a group array and `postProcess = false` | stores the raw array (never exercised: internal calls pass ids or `null`) | `NotImplementedError` | guard, never store garbage |
| `update(id, { group: [...] })` group reconciliation | `findRemovedIds` compares populated docs by `toString()` (never matches), so every previous member is unset and re-set | removed members unset, kept members re-pointed | same final state; fewer writes |
| `getByIdWithPopulatedFields` with a non-reference path | populate of an unknown path is a no-op | `NotImplementedError` | loud per §1.5 |
| `cascadeUpdateDataHash(old, new, session)` | runs inside the Mongo `ClientSession` | `NotImplementedError` when a session is passed (dead method, zero callers) | no cross-backend transactions |
| `manualOverrideField` on an unmapped field | `$set` any path | `NotImplementedError` outside the AI/body columns | loud per §1.5 |
| missing required field / duplicate `data_hash` on `create` | Mongoose `ValidationError` / `E11000` → 400 | `23502` / `23505` → the same 400 messages | parity kept on the wire |
| `listAll` ordering | `_id` (monotonic ObjectId) | `created_at` + `id` tiebreak | equivalent except for rows inserted inside the same timestamp tick |
| `listAll` with `sourceChannel` as a single string | `$in: "Web"` → server error (500) | treated as `["Web"]` | the UI only sends `"all"` or nothing; PG fixes the latent 500 |
| history writes on `create` / `update` / topics update | `HistoryService` entries | deferred until Phase 6 ports history (same as personality) | `getHistoryParams` rejects non-ObjectId ids |
| ids reaching the AI result validator | `isValidObjectId` | uuid regex | shared rule takes the backend's `isValidId` predicate |
| `embedding` on returned entities | projected out on reads, present on `create`/`findByDataHash`/AI updates | same projection choices | parity |
| `update(id, { source: [] })` / `{ source: null }` | stores `[]` / `null` | stores `[]` (`source_ids` is NOT NULL) | the edit drawer sends `[]` when every url is removed; both clear |
| `update` with an impact-area label or option | stores the raw string (the `@Prop` uses the bson class, so no cast) and the `listAll` filter can never match it | resolves through the closed list to the topic id; an unknown label is `NotImplementedError` | loud per §1.5 instead of a garbage uuid cast; ids and populated topics pass through |
| `checkAndRetryStaleAiTasks` | `Object.entries` on a Mongoose `Map` yields nothing, so stale pending tasks are never cleared and the retry never fires | clears the stale fields and re-triggers the missing states | pre-existing Mongo bug left as-is (move-only); PG is the intended behavior |
| `date` default | `@Prop({ default: new Date() })` is evaluated once at class load (one timestamp for every row created without `date` since boot) | `defaultNow()` per row | PG is the intended semantics |
| `updateFieldByAiTask` progress estimate | averages the transitions read before the new one is pushed (n-1) | re-reads after the push (n) | estimate only; `estimatedCompletion` is dropped from parity |
| `getStats` snapshot | one `$facet` pipeline | three statements outside a transaction | counts can disagree under concurrent writes; dashboard tolerance |

Verification requests are **global** (no `nameSpace` on the Mongo schema; the DTO's `nameSpace` was already dropped by the strict schema). Reference columns per D3: `impact_area_id`/`topic_ids` → topic, `identified_data_ids` → personality, `source_ids` → source, `group_id` → `content_group`, all btree/GIN indexed. The Mongo `pre("find")` source populate becomes an explicit batched select on every `find`-shaped read (`listAll`, `findAll`, `findBySourceUrl`), matching which Mongo reads were populated. The stats service ports as its own token (`"VerificationRequestStatsService"`). `VerificationRequestModule.register()` keeps the `forwardRef` cycle with the state-machine service through the string token. Pre-existing Mongo quirk left as-is: `PUT /:id` with a string `impactArea` stores a string (the `@Prop` uses the bson class, not the SchemaType), so the Mongo `listAll` impact-area filter cannot match it; the contract suite sets impact areas through the AI path.

**Report module (Phase 2, leaf) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `create` | `save()` is fire-and-forget (`void`); returns the hydrated doc | awaited insert, entity | the row exists when the caller continues |
| `sources` | `string[]` prop that review-task feeds `{ href, props }` objects (Mongoose cast) | hrefs (`string` or `.href`) | `createReportSources` side effect identical |
| `usersId` | single ObjectId despite the plural name | `user_id uuid` | users port in Phase 4 |
| `findByDataHash` with several reports per hash | natural (insertion) order | `created_at, id` | equivalent |

Report is **global**; the classification check is the shared rule `shared/report.rules.ts`. The source side effects of `create` are fire-and-forget on both backends (parity; a rejected source create is logged, never surfaced).

**Claim content types (Phase 2 MR 1: sentence / paragraph / speech / unattributed) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `content` arrays (speech → paragraphs → sentences) | ordered ObjectId arrays + `pre("find")` populate hooks | ordered `content_ids uuid[]` (GIN) + explicit batched loads in `server/claim/postgres/content-tree.ts` | admin-editor shares unedited sentence rows between revisions, so the link is an ordered array, not a parent column |
| sentence `findAll` search | Atlas `$search` (`sentence_fields`, fuzzy `maxEdits`) on `content`, or on the `topics` path when only a filter is given | `content % $q` (pg_trgm, `db.postgres.fuzzy_threshold`) ordered by similarity; the topics filter is `topics ?| $filters` (string elements, like `$in`) | ranking differs within tolerance; the Mongo `$match` on `topics` is the effective filter on both |
| sentence `findAll` visibility | `$ne: true` over the `$lookup` arrays (`claimContent`, `personality`) | inner join on a visible claim in the namespace + `NOT EXISTS` hidden/deleted personality | same rows: an orphan revision or a hidden personality excludes the sentence on both |
| `updateSentenceWithTopics` return | pre-update doc (`findByIdAndUpdate` without `new: true`) | updated entity | callers ignore the body (image already returns the updated doc on Mongo) |
| `getHashesByTopic` | `topics.id` compared to an ObjectId | jsonb containment `topics @> [{"id": uuid}]` | same predicate on the id the topic service wrote |
| `getSpeech` / `getRevision` content | populate hooks, `personality` ref never populated | content tree loaded explicitly, `personality` stays an id | parity |
| `unattributed` | no `claimRevisionId`, no `data_hash` (the parser never sets them) | same columns absent | parity; README spec drift left as-is |

**Claim-revision module (Phase 2 MR 1) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `getRevision(match)` | any Mongo filter | `_id` / `claimId` / `contentId`, else `NotImplementedError` | loud per §1.5 |
| `create` with `Image` / `Debate` | creates the image / debate document | `NotImplementedError` | Phase 2 MR 2 |
| `create` with an unknown `contentModel` | no content document, then `contentId required` ValidationError (400) | `BadRequestException` (400) | same code, no orphan writes |
| `findAll` search | Atlas `$search` (`claimrevisions_fields`) on `title` | `title % $q` (pg_trgm) + the same visibility rules as sentences | ranking differs within tolerance |
| `getByContentId` | **move-only exception:** the Mongo impl now casts `new Types.ObjectId(String(contentId))` itself (the `contentId` `@Prop` uses the bson class, so Mongoose does not cast query values) | `content_id = $1` | the cast moved out of `claim.controller.ts` so controllers stay backend-neutral; prod callers already passed ObjectIds |
| `create` sources | `_createSources` through the `"SourceService"` token | same | shared |

`(content_model, content_id)` is the polymorphic pair behind the Mongo `content` virtual (`refPath: "onModel"` on the Mongo schema is dead — no such field). `content_id` is NOT NULL. History is not written by either impl (the Mongo claim service writes it).

**Claim module (Phase 2 MR 1) divergences:**

| Behavior | Mongo (authoritative, untouched) | Postgres | Why |
|---|---|---|---|
| `listAll`, `getById`, `getByClaimSlug` / `getByPersonalityIdAndClaimSlug` with `population = true`, reads with a `revisionId` | `postProcess` annotates sentences from claim-review + review-task and adds review stats | `NotImplementedError("postProcess(claim-review, review-task)")` **after** the row lookup (a missing claim is still a 404) | needs `claim-review` (Phase 3) and `review-task.getReviewTasksByClaimId` (Phase 5, or a leaf read in Phase 3); returning unannotated content would be silently wrong |
| `population = false` reads (`getByClaimSlug(slug, undefined, false)`, …) | flattened latest revision + `personalities { _id, name }` + `sources { _id, href, targetId }` | same shape (parity-recorded) | the SSR pages use this path |
| `update` | throws `TypeError` (`toObject` on a `.lean()` doc) — broken, no frontend caller | `NotImplementedError` | port when a caller exists |
| history + state-event writes on `create` / `update` / `delete` / hide | written | deferred until Phase 6 | `getHistoryParams` rejects non-ObjectId ids |
| `create` without `personalities` | `claim.personalities.map` → TypeError 500 | `[]` | the frontend always sends an array |
| `create` with a non-string `nameSpace` | duplicate check against `{ $eq: undefined }`, row saved with the `main` default | resolves `main` before the check | the DTO requires a string anyway |
| duplicate `(nameSpace, slug)` race | app-level check only (no index) | partial unique `claim_name_space_slug_uq` → `DuplicateKeyError` 409 | unique constraints are not deferred (D3) |
| `groupService.updateWithTargetId` on `create` | fire-and-forget | awaited | one fewer race; same final state |
| `delete` / `hideOrUnhideClaim` return | `UpdateWriteOpResult` | `{ modifiedCount }` | callers read nothing from it |
| malformed id | CastError swallowed by the blanket catch → 404 | `22P02` mapped → 404 | parity kept on the wire |
| `count` | `countDocuments(query)` — no soft-delete auto filter | same (`isDeleted` only when the caller passes it) | parity; stats passes `isDeleted: false` |
| `create` return | `{ ...revision.toObject(), ...claim.toObject() }` | `{ ...revisionEntity, ...claimEntity }` | parity-recorded |

Claim is **tenant-scoped** (`name_space`, composite index with `is_hidden` and `created_at`). Both impls are `Scope.REQUEST` so `util.getParamsBasedOnUserRole` keeps the role-based hidden filtering (personality's PG impl still defers it). Reference columns per D3: `personality_ids uuid[]` (GIN), `latest_revision_id`, `group_id`. Zod tightenings versus the class DTOs: `date` accepts ISO datetimes and `YYYY-MM-DD` (not the week/ordinal forms `IsDateString` allowed), `sources` and `personalities` elements must be strings, the image body's `content` must be an object, `:id` / `:debateId` params must be an ObjectId or uuid (a malformed `debateId` was a BSONError 500).

Known deferred-by-design on personality (remove at the phase that unblocks them): `getClaimsByPersonalitySlug`, `postProcess`, `getReviewStats` (Phase 3), `combinedListAll` (needs the above), history writes on hide/unhide (history phase). Personality reaches zero 501s only after Phase 3 — the first cutover-eligible milestone.

---

## 7. Roadmap and dependency order

Foreign-key *columns* dictate what must exist before what (constraints come later, D3):

```
✅ Phase 0    Foundation + personality (this MR)
✅ Phase 0.5  Leaf tables: source ✅ / topic ✅ / badge ✅ / group ✅ (landed with Phase 1) [S]
✅ Phase 1    verification-request + group + pgvector + parity recorder/CLI + real-PG CI + DB_METRICS [M]
🔶 Phase 2    claim + claim-revision + content types (+ report leaf)         [L] → MR 1 ✅ claim, claim-revision, sentence/paragraph/speech/unattributed, report; MR 2: image, debate, admin-editor
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

### Per-phase porting notes (merged from the completion checklist)

**Phase 1 — verification-request** [M] ✅. The Mongo similarity is a dot
product (not cosine), so the port uses pgvector's inner product
(`-(embedding <#> $1)`) with the same 0.8 threshold. The embedding column is a
dimensionless `vector`: the worker's `DEFAULT_EMBEDDING_MODEL` is
`nomic-embed-text` (768) while `config.example.yaml` suggests
`text-embedding-3-small` (1536), so the dimension is deployment config.
**Cutover prerequisite:** pin the model, add a migration with the typmod
(`ALTER COLUMN embedding TYPE vector(N)`) and an HNSW index
(`USING hnsw (embedding vector_ip_ops)`), and backfill or re-embed rows whose
length differs. Populate chains became batched selects (see the divergence
table). Cross-cutting tooling landed in §3 (parity, real-PG CI, `DB_METRICS`).
The `new Types.ObjectId(id)` source-id wrap stayed on the Mongo side only.

**Phase 2 — claim + claim-revision + content types** [L]. Atlas `$search` on
sentence content/topics (`sentence.service.ts:85-108`) → trgm GIN on `content`;
`topics` is an array — needs `unnest` + trgm or a `claim_topic` join table.
`$search` on revision title (`claim-revision.service.ts:~105`) → trgm GIN.
3-way `$lookup` chains (sentences → claimrevisions → claims → personalities) →
CTEs or chained joins. Modeling: Mongo `Claim` discriminates by a `contentType`
field in code (no Mongoose discriminators) — **single `claim` table with
`content_type` + nullable type-specific columns** unless type-specific columns
exceed ~10; `claim_revision` is a straight port with a `claim_id` reference.
Unblocks personality's `getClaimsByPersonalitySlug` + `extractClaimWithTextSummary`.

**Phase 2 MR 1 (landed):** the modeling note above was amended by the port. The
content types stay separate tables (`sentence`, `paragraph`, `speech`,
`unattributed`; `image` and `debate` in MR 2) because they are separate Mongo
collections with their own readers (`GET api/sentence/:data_hash`, topics,
events `$lookup`s) and admin-editor shares sentence rows across revisions;
`claim_revision` carries the polymorphic `(content_model, content_id)` pair and
the trees are assembled by `server/claim/postgres/content-tree.ts`. `report`
ported as a leaf so the sentence read carries its classification. The claim
`postProcess` enrichment (review annotations + stats) is a 501 until
claim-review (Phase 3) and the review-task claim lookup port — Phase 3 should
include `review-task.getReviewTasksByClaimId` as a leaf read so Milestone A
does not wait for Phase 5. Shared rules: `shared/claim.rules.ts` (slug,
content assembly, review annotation, overall stats), `shared/report.rules.ts`.
`ParserService` is backend-neutral (tokens only). `extractClaimWithTextSummary`
moved to `personality/shared/` and the topic `create(contentModel)` guard now
covers only `Image`.

**Phase 3 — claim-review** [M]. Nested `$lookup` chains
(`claim-review.service.ts:~150-176`) → multi-CTE SQL; status counts today are a
`$count` stage plus app-side JS reduces (no `$facet`) → collapse into
`count(*) FILTER (WHERE status = ?)` in one query. `pre("find")`
auto-populate hooks → explicit Drizzle relational queries. Unblocks personality's
`getReviewStats` + `combinedListAll` → **personality reaches zero 501s here**.

**Phase 4 — users + roles/badges** [M]. Ory Kratos keeps identity primitives
(its own Postgres); Aletheia's `users` collection is profile/role/badge data
keyed to Kratos identity ids. Open before scoping: are roles in Aletheia's DB or
Kratos traits? Badge storage: rows vs array column. `pre("find")` badge-populate
hook → explicit joins.

**Phase 5 — review-task + comment** [M]. XState machine is client-side; DB only
persists state — straightforward schema. `comment` is a child entity with a
`review_task_id` reference.

**Phase 6 — source/topic/group/badge/history/state-event/tracking (full
services)** [M aggregate, each S]. Mostly CRUD; bundle into one or two MRs.
`history` has a `$facet` aggregation (`history.service.ts:114-180`) → single SQL
query with conditional joins.

**Phase 7 — events/stats/daily-report/vr-stats** [L]. The heaviest `$facet` +
`$lookup` pipelines: `event.service.ts:~317-358` (3× nested `$lookup` + `$facet`
→ multi-CTE), `verification-request-stats.service.ts:59-100` (`$facet` →
`FILTER` clauses), `daily-report` → candidate for nightly-refreshed materialized
views. Performance-critical: §8 perf gates are blocking here.

**Phase 8 — ai-task/copilot/summarization/AFC/chat-bot/files** [M]. Thin DB
layers orchestrating external APIs (Novu, LLM providers, S3). `copilot`/`AFC`
reuse Phase 1's pgvector patterns; `file-management` needs only metadata tables.

**Phase 9 — editor/collaborative/yjs** [L, highest uncertainty]. Yjs CRDT state
as opaque blobs → `bytea`. Phase spec must confirm persistence shape; hybrid
retention (Mongo for Yjs blobs only) is the last resort, decided then.

**Phase 10 — backfill tooling + FK constraints** [M]. One-shot per-collection
scripts under `scripts/migrate-to-postgres/`: read via Mongoose models, map
ObjectId → UUID (uuid v5, fixed namespace), write via Drizzle, idempotent
(`INSERT ... ON CONFLICT DO NOTHING` keyed on `legacy_object_id` — the column
every table already carries per §2). Driver: `yarn migrate:to-postgres` in
dependency order. FK constraints land here via `ADD CONSTRAINT ... NOT VALID` +
`VALIDATE` (D3).

**Phase 11 — sunset MongoDB** [S]. Remove `mongodb`/`mongoose`/
`@nestjs/mongoose`/`mongoose-softdelete-typescript`/`mongodb-memory-server`/
`migrate-mongo-ts`; delete every `<module>/mongo/` dir, `migrations/`,
FerretDB CI/compose services; remove the `DB_TYPE` switch; drop
`legacy_object_id` columns; keep the `I*Service` interfaces (testability) but
delete the now-trivial type-tests; update CLAUDE.md.

### Atlas → Postgres feature map (global inventory)

| Atlas/Mongo feature | Where used | Replacement |
|---|---|---|
| `$search` fuzzy text | personality `name`, sentence `content`, revision `title` | `pg_trgm` GIN + `%` operator + `similarity()` ranking |
| `$vectorSearch` / manual cosine | verification-request, copilot/AFC | `pgvector` `<=>`, HNSW index |
| `$lookup`/`$facet` pipelines | claim-review, events, history, stats | CTEs, `count(*) FILTER`, materialized views |
| Change streams | not used | — |
| GridFS | not used (S3) | — |
| Mongoose discriminators | not used (`contentType` field in code) | single table + `content_type` column |
| Soft-delete plugin | all models | `is_deleted`/`deleted_at` + partial indexes (§2) |

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
| Silent test skips masking coverage | all | D4.2 canary + ungated contract suite; `test:pg` sets `CI_EXPECT_DB_TYPE` so a stale local `.env` `DB_TYPE` fails loudly |
| pglite ≠ real Postgres (pool semantics, locale/collation ORDER BY, extension availability) | 1+ | `vitest-postgres-real` job runs the migrations and the unit suite on `pgvector/pgvector:pg16` (`TEST_POSTGRES_URL`); collation-sensitive assertions avoid locale-dependent ordering |
| Embedding dimension drift between deployments | 1 → cutover | dimensionless `vector` until the model is pinned; typmod + HNSW migration is a cutover prerequisite (§7 Phase 1) |
| Stray `DB_TYPE` env var disagreeing with config.yaml | deploys | boot fails fast by design (`app.module.ts` mismatch throw) — call out in deploy runbooks |
| Drizzle pre-1.0 API churn | all | exact version pins; one deliberate upgrade per phase max |
| `forwardRef(() => X.register())` inside a dynamic module (Nest 9 boot death) | all | §3 module-wiring rule: modules in forwardRef cycles stay static; the parser e2e spec boots the whole `AppModule` and catches it |
| Merge-conflict contamination on long-lived branches | all | verify branch diff vs non-merge-commit file list before every MR |
| Connection-pool exhaustion as modules grow | all | single shared pool + exhaustion metrics |

---

## When this migration is done

Every phase shipped dark and gated (§5), cut over per §8, parity-verified, reversible at each step; FK constraints validated in Phase 10; Phase 11 removes Mongo, the `toEntity` `_id` alias, and the compatibility shims — no big-bang, no unverified cutover, a rehearsed rollback at every milestone.
