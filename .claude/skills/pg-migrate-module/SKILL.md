---
name: pg-migrate-module
description: Port an Aletheia server module from MongoDB to Postgres following the established Phase 0 pattern. Use when asked to "migrate <module> to postgres", "port <module>", "do phase N of the postgres migration", or to continue the MongoDB → Postgres migration for any module. Covers the full flow — recon, interface extraction, Drizzle schema, service port, dual-backend contract tests, wiring, validation — against docs/postgres-migration-foundation.md.
---

# Migrate a module to Postgres

You are porting ONE module per MR, following the pattern proven by the
personality module (Phase 0). The single source of truth is
**`docs/postgres-migration-foundation.md`** — read it FIRST, in full, before
touching anything. This skill is the operational driver; the foundation doc is
the authority. Where they disagree, the doc wins — and update whichever is stale.

**Reference implementation (copy its shape, not blindly its code):**
- `server/personality/` — interface split, `mongo/` + `postgres/` siblings,
  `shared/personality.rules.ts`, provider factory, module wiring
- `server/personality/personality-contract.spec.ts` — dual-backend contract suite
- `server/personality/personality.service.type-test.ts` — compile-time surface gate
- `server/tests/postgres-setup.ts` + `server/tests/mongo-contract-setup.ts` — test rails
- `server/database/errors.ts` — neutral error taxonomy (`NotImplementedError` → 501,
  `DuplicateKeyError` → 409)

## Hard rules (from the foundation doc — never violate)

1. **Mongo impl is move-only.** Relocate it behind the interface; never rewrite
   its behavior. Any genuine Mongo bug fix is a separate, called-out commit that
   the user approves.
2. **No silent scope reduction.** Anything the Postgres impl can't honor yet
   (a query param, an ordering mode, an enrichment step) throws
   `NotImplementedError("postgres", "<method(detail)>")` — never an ignored
   parameter or empty result.
3. **No business rule in two places.** Driver-free logic goes in
   `server/<module>/shared/<module>.rules.ts` (pure functions, no mongoose/
   drizzle/pg/schema imports), consumed by both impls.
4. **Contract tests run BOTH backends, ungated.** Never `skipIf(DB_TYPE...)` a
   contract spec. `DB_TYPE` gating is only for wiring tests and pg-only specs.
5. **No FK constraints** (deferred to Phase 10). Reference columns still land:
   `uuid` named `<entity>_id`, btree-indexed. Unique constraints are NOT
   deferred.
6. **Never edit an applied migration.** New schema = new drizzle-kit migration
   (`yarn migrate:pg:create --name=<name>`); drizzle-kit owns `meta/_journal.json`.
7. **Schema conventions** (foundation doc §2): snake_case, singular table names,
   `<table>_<col>_uq|idx` index naming, soft-delete triple (`is_deleted`,
   `deleted_at`, partial unique indexes excluding deleted), `timestamptz`,
   `id uuid defaultRandom()`, `legacy_object_id text` + partial unique index,
   `name_space` column on tenant-scoped tables (check the Mongo schema — record
   in the MR if the module is global).
8. **Small commits**, one method or method-group each, conventional-commit
   style (`feat(<module>): postgres <method>`).

## Workflow

### Step 0 — Orient
- Read `docs/postgres-migration-foundation.md` (all of it; §4 recipe, §5 ship
  gate, §7 for this module's phase notes — Atlas feature mappings, aggregation
  rewrites, and modeling decisions are pre-analyzed there per phase).
- Confirm with the user which module/phase, and check §7 dependency order: if
  this module joins tables that don't exist yet, port those leaf tables'
  schema + minimal read surface in the same MR (never read across backends).

### Step 1 — Recon (read-only; use an Explore agent for breadth)
Map before writing:
- The Mongo service's FULL public surface and every external caller
  (`grep -rn "<module>Service\." server/ src/` — callers define the real
  contract, including quirky arg orders and `limit(0)`-style semantics).
- The Mongoose schema: fields, indexes, hooks (`pre("find")` auto-populates
  become explicit Drizzle queries), soft-delete plugin, discriminators.
- Atlas features in use (`$search`, `$vectorSearch`, `$lookup`, `$facet`) —
  §7 of the doc says what each becomes.
- Driver-specific error handling in controllers/services
  (`MongoError`, `err.code === 11000`) — these get swept to the neutral taxonomy.
- Cross-module methods that need unported collections → they throw 501 this MR;
  list them explicitly.
- Behavioral traps to look for (all hit in Phase 0): positional-arg mismatches
  between impl and interface, `limit(0)` = unlimited, upsert defaults,
  required-vs-defaulted fields, null-vs-throw on missing rows.

### Step 2 — Structure (behavior-preserving commits)
1. Extract/verify `I<Module>Service` in `server/interfaces/` — full surface,
   NO mongoose/drizzle types (neutral refs like `PersonalityRef`).
2. Move the Mongo impl to `server/<module>/mongo/` (move-only), wire
   `<module>.provider.ts` factory + `<module>.module.ts` `dbConfig.type` branch
   (copy `personality.provider.ts` / `personality.module.ts`).
3. Extract shared rules to `shared/<module>.rules.ts` + direct unit spec.
4. Add the type-test (`<module>.service.type-test.ts`, copy the personality one).
   `yarn build-ts` must pass before any Postgres code exists.

### Step 3 — Schema + migration
- `server/<module>/postgres/schema/<entity>.schema.ts` per the conventions;
  re-export from `server/database/postgres/schema/index.ts`.
- `yarn migrate:pg:create --name=<module>` (drizzle-kit takes `--name=`, not a
  positional arg) → review the generated SQL by hand
  (indexes present? partial predicates right?) → `yarn migrate:pg:status` clean.

### Step 4 — Port methods (TDD against the contract suite)
- Create `<module>-contract.spec.ts` modeled on the personality one: a
  factories array registering BOTH backends (pglite via `getTestDrizzle`/
  `resetTestDrizzle`; Mongo via a `server/tests/mongo-contract-setup.ts`-style
  per-worker memory server with the module's model + stubbed DI deps), `idOf()`
  normalization for ObjectId/uuid, per-backend `makeMissingId()`.
- Red → green, one method per commit. Every return path goes through a
  `toEntity()` mapper exposing `_id` — never a raw row cast.
- Native idioms per backend: Drizzle `db.transaction` where Mongo used
  sessions; `SET LOCAL` needs `sql.raw` (no bind params in SET) inside a
  transaction.
- Map driver errors at the boundary: pg `23505` → `DuplicateKeyError`;
  missing row → `NotFoundException`. Sweep the module's controllers off
  driver-specific catches (keep the Mongo path's observable behavior).
- Backend-specific behavior (index semantics, trgm ranking, documented
  divergences) goes in `<module>.postgres.spec.ts`, gated
  `describe.skipIf(process.env.DB_TYPE !== "postgres")`.

### Step 5 — Validate (all must pass; run in this order)
```bash
yarn build-ts            # type-test gate included
yarn test:unit           # default env — contract suite runs BOTH backends here
yarn test:pg             # full unit suite under DB_TYPE=postgres
yarn test:e2e            # Mongo regression net
yarn migrate:pg:status   # drizzle-kit check
yarn lint
```
Plus MR hygiene:
- `git diff origin/stage...HEAD --stat` — ONLY this module + shared infra.
  If merge commits contaminated unrelated files, restore stage versions
  (see foundation doc §9 risk "merge-conflict contamination").
- Walk the §5 ship-gate checklist in the foundation doc item by item; paste it
  checked into the MR description.
- Every intentional Mongo↔Postgres divergence found goes in the foundation
  doc's "Known divergences" table — silent divergence is a bug.

### Step 6 — Close out
- Update the foundation doc: §7 phase status, any 501s this phase removed
  from earlier modules (delete their `NotImplementedError`s + un-skip tests),
  new divergences, new conventions discovered.
- Merge dark: prod stays `DB_TYPE=mongodb`. Merging ≠ cutting over (§8).

## From Phase 1 onward (cross-cutting additions)
Phase 1 (verification-request) also builds, and later phases reuse:
`scripts/parity/` differ, the real-Postgres CI service-container job, the
per-method latency/error interceptor, and the `expectParity(op)` contract
helper. If they exist when you run, extend them for this module; if you ARE
Phase 1, build them per foundation doc §8/§9 (D4.4, D4.5).
