# Postgres foundational layer

This directory hosts the cross-cutting Postgres infrastructure: the Drizzle
client provider, the connection factory, the schema barrel, and the test
harness.

## Adding a new module to Postgres

To enable Postgres support for an existing Mongo-backed module:

1. **Define the resource interface** at `server/interfaces/<module>.service.interface.ts`
   if one doesn't already exist. The interface must capture every method the
   controllers and other modules call on the service.

2. **Add the Drizzle schema** at `server/<module>/postgres/schema/<entity>.schema.ts`
   and re-export it from `server/database/postgres/schema/index.ts`.

3. **Generate a migration:** `yarn migrate:pg:create <module>` — review the
   generated SQL in `migrations-postgres/`, edit if needed, commit.

4. **Implement the service** at `server/<module>/postgres/<module>.service.ts`,
   `implements I<Module>Service`. Inject Drizzle via `@Inject(DRIZZLE)`.
   For methods that require collections not yet ported, throw
   `new NotImplementedError("postgres", "<methodName>")` from
   `server/database/errors.ts`.

5. **Add the type-test** at `server/<module>/<module>.service.type-test.ts`
   following the pattern in `server/personality/personality.service.type-test.ts`.
   This is enforced by `yarn build-ts`.

6. **Wire the module** — extend the existing `<module>.module.ts` and
   `<module>.provider.ts` with a `postgres` branch matching the `mongodb` one.

7. **Add tests:**
   - `server/<module>/<module>-contract.spec.ts` — backend-agnostic CRUD tests
     parameterized over `IPersonalityService`-style factories.
   - `server/<module>/<module>.postgres.spec.ts` — postgres-specific behavior
     (index usage, trigram tuning, NotImplementedError assertions).
   - Both files use `getTestDrizzle()` / `resetTestDrizzle()` from
     `server/tests/postgres-setup.ts`.

## Public-surface convention

To add a new capability to a resource interface:

1. Update the `I*Service` interface.
2. Implement it in *both* `mongo/` and `postgres/`.
3. The corresponding `<module>.service.type-test.ts` must compile.

Do not add public methods anywhere else. Helpers are `private` or `protected`.
The type test is the gate; it runs as part of `yarn build-ts`.

## Phase 0 limitation

Today the personality module is the only one with a Postgres impl. The
controller and module-level wiring import sibling modules (`ClaimReviewModule`,
`ClaimRevisionModule`, `HistoryModule`) which still call
`MongooseModule.forFeature(...)`. As a result, the Aletheia server cannot
actually boot under `DB_TYPE=postgres` until those modules are ported (see
`docs/superpowers/specs/2026-05-10-postgres-completion-checklist.md`).

What works today under `DB_TYPE=postgres`:
- The personality unit + contract test suites (against pglite, in-process).
- The compile-time type-test gate (`yarn build-ts`).
- The CI `vitest-postgres` job.

What does NOT work today:
- `DB_TYPE=postgres yarn dev` (NestJS bootstrap fails on Mongoose `forFeature`
  registrations in sibling modules).
- `DB_TYPE=postgres yarn test:e2e` (same reason).

Phase 1 (verification-request) and the subsequent module ports remove these
limitations incrementally.
