# Postgres Migration — Architecture Decisions

**Date:** 2026-09-18
**Status:** Accepted
**Context:** Phase 0 (foundation + personality slice). These decisions apply to every subsequent module port.

---

## Decision 1 — Shared rules module: business logic lives once, used by both services

### The problem

The current pattern ships two full service implementations per module
(`mongo/<module>.service.ts` and `postgres/<module>.service.ts`) selected at
boot by `DB_TYPE`. This duplicates not only queries (intended) but also
**business rules** (unintended). The Phase 0 parity audit found exactly this
failure class: the Postgres personality service initially diverged from Mongo
on slug derivation, soft-delete restore on create, wikidata backfill, and the
default description template — all pure logic, none of it database-specific.

A full repository pattern (one service + two repositories) was considered and
rejected: it would require refactoring every working Mongo service now (risk
to the live production backend), and the aggregation-heavy modules don't
decompose into backend-neutral repository methods anyway.

### The decision

Keep the dual-service seam as the swap mechanism, but extract every piece of
logic that does not touch the database driver into a **shared rules module**
that both implementations import:

```
server/<module>/
  shared/<module>.rules.ts       ← pure functions, no driver imports
  mongo/<module>.service.ts      ← Mongoose queries + calls shared rules
  postgres/<module>.service.ts   ← Drizzle queries + calls shared rules
```

**Rule: no business rule may exist in both implementations.** If the same
logic appears in `mongo/` and `postgres/`, it must move to `shared/`. This is
a per-phase ship gate, alongside the contract tests and the type-test.

For personality, the shared candidates are:

- slug derivation — `slugify(name, { lower: true, strict: true })`
- default description template — `wikidata?.description || "Personality: <name>"`
- `verifyInputsQuery` input normalization
- any future validation / decision logic that is backend-agnostic

### What stays duplicated (intentionally)

- Query construction (Mongoose chains vs Drizzle SQL) — divergence here is
  inherent and covered by the backend-parameterized contract tests.
- Transaction orchestration — each backend keeps its native idiom
  (Mongo sessions vs `db.transaction` + `SET LOCAL`).
- Row/document → entity mapping (`toEntity` on the Postgres side).

### Constraints on `shared/` code

1. Pure functions only. No `this`, no DI, no driver or model imports.
2. No imports from `mongoose`, `drizzle-orm`, `pg`, or any schema file.
3. Unit-tested directly, once — not through either backend.

### Consequences

- The parity-bug class found in Phase 0 becomes structurally impossible for
  extracted rules.
- Mongo services change only by moving logic out (mechanical, behavior-
  preserving) — no rewrite of the production path.
- Contract tests shrink to what genuinely can diverge: query semantics.
- At Phase 11 (Mongo sunset), `shared/` merges into the surviving Postgres
  service or stays as-is; nothing is thrown away.

---

## Decision 2 — ORM: keep Drizzle

Evaluated against Prisma, TypeORM, MikroORM, Kysely, and raw `pg`. Drizzle
stays because the migration's hard requirements match it exactly:

- SQL-level control for parity porting (partial indexes excluding
  soft-deletes, `SET LOCAL pg_trgm.similarity_threshold`, GIN/trgm, pgvector).
- First-class pglite driver + migrator — the dual-backend CI strategy
  depends on it.
- Plain SQL migration files (reviewable DDL across 11 more phases).
- Thin DI fit (single `DRIZZLE` token, no decorators or codegen step).
- Types inferred from schema (`$inferSelect` / `$inferInsert`).

Rejected alternatives, in one line each: Prisma cannot express partial
indexes in its schema and pushes all the hard 20% into raw-SQL escape
hatches; TypeORM carries known maintenance and type-safety debt; MikroORM
would force rewriting the Mongoose side too; Kysely lacks schema-driven
migrations and type inference; raw `pg` gives up type safety entirely.

**Risk management:** pin `drizzle-orm` and `drizzle-kit` to exact versions
(no `^`) — both are pre-1.0 and break between minors. Upgrades are deliberate,
one per phase at most, never implicit.

This decision is settled. Do not relitigate it in later phases; if a
blocking limitation appears, amend this document with the evidence.

---

## Decision 3 — Defer FK constraints to the end of the migration

Module ports ship **without foreign-key constraints**. Relational modeling
(FKs, ON DELETE policy) happens once, deliberately, after all modules are
ported — naturally alongside Phase 10 backfill tooling.

### Rationale

- Mongo has zero referential integrity today; `management/` does app-level
  cascade soft-deletes. A constraint-free Postgres is *parity* with the
  system we are proving equivalence against.
- Legacy Mongo data contains orphaned references. Constraints during
  backfill would turn every phase into data archaeology; deferring
  concentrates the cleanup into one pass with all tables present.
- Dual-write (Strategy B) requires PG writes to be best-effort; FK
  violations on writes Mongo accepted would break that model.
- Postgres supports late adoption cleanly:
  `ALTER TABLE ... ADD CONSTRAINT ... NOT VALID` followed by
  `VALIDATE CONSTRAINT` — no long locks, and validation forces explicit
  orphan resolution.

### Guardrails (non-negotiable)

1. **Only the constraint is deferred — never the column.** Every reference
   lands with its module as a `uuid` column named `<entity>_id`, with a
   btree index (joins need it regardless). This convention makes the final
   FK pass a mechanical grep.
2. **Unique constraints are NOT deferred.** Partial unique indexes like
   `personality_wikidata_uq` are correctness (dedup logic depends on them),
   not relational modeling. They ship with each module.
3. **Orphan-check script before any cutover.** A per-reference
   `LEFT JOIN ... WHERE IS NULL` sweep runs as part of the parity gate, so
   orphan counts are known before flipping any deployment — even though
   constraints arrive later.

---

## Decision 4 — Testing strategy: dual-backend contract tests, ungated

The test pyramid per module is settled as: compile-time type-test (surface
drift) → contract spec (behavior parity) → backend-specific specs (driver
details) → CI matrix. The following rules make it reliable:

### 4.1 Contract tests run BOTH backends in every run — no `DB_TYPE` gate

The contract suite must register a Mongo factory (mongodb-memory-server)
AND a Postgres factory (pglite) and run unconditionally. Both databases are
in-process; no environment switching is needed for parity tests.

Rationale: as of Phase 0 the contract suite only registered Postgres and was
`describe.skip`ped under the default `DB_TYPE=mongodb` — meaning Mongo's
behavior was assumed from reading code, never asserted, on every dev run and
the main CI job. A one-sided contract test is not a contract test.

`DB_TYPE` gating remains only for wiring-level tests (provider/module boot)
and the full-suite CI matrix — never for contract specs.

### 4.2 No silent skips

A green CI job must prove its tests executed, not just that none failed:

- The `vitest-postgres` CI job includes a canary spec that fails unless
  `process.env.DB_TYPE === "postgres"`.
- `DB_TYPE` is removed from `.env` (env-cmd overrides the shell, so a local
  `DB_TYPE=postgres yarn test` silently ran Mongo). A dedicated `test:pg`
  script sets it explicitly.

### 4.3 Boot smoke test under postgres

A minimal spec asserts the Nest `AppModule` compiles with
`DB_TYPE=postgres`. This catches the per-phase failure mode where a
controller or service still injects a Mongoose model that does not exist
under the Postgres branch — a DI wiring break invisible to unit tests.

### 4.4 Parity helper (Phase 1 opener)

Once both backends are registered, contract assertions evolve toward an
`expectParity(op)` helper: run the same operation against both services,
normalize (`_id`/`id` alias, timestamp precision), deep-diff the results.
Catches divergences nobody thought to assert and seeds the Phase 1
data-parity harness (`scripts/parity/`).

### 4.5 Real-Postgres CI leg (Phase 1 opener)

pglite validates logic; a `postgres:16` service-container job validates what
pglite cannot — migration SQL against a real server (`CREATE EXTENSION`
availability, partial-index behavior, pool semantics). Same suite, real
connection string.
