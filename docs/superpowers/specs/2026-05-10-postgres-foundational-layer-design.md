# Postgres Support — Foundational Layer + Personality Slice

**Date:** 2026-05-10
**Status:** Draft, pending user review
**Scope:** Foundational layer for Postgres-backed deployments + one fully-ported vertical slice (`personality` module).
**Companion doc:** [`2026-05-10-postgres-completion-checklist.md`](./2026-05-10-postgres-completion-checklist.md) — phased plan to reach Mongo→Postgres parity across all modules.

---

## 1. Goal and non-goals

### Goal
Land the infrastructure that lets a deployment of Aletheia run on Postgres instead of MongoDB, and prove the pattern end-to-end on the `personality` module.

After this work merges:
- A new deployment can set `DB_TYPE=postgres` and the application boots, runs migrations, and serves traffic for personality CRUD + fuzzy name search.
- Existing MongoDB deployments are unaffected (`DB_TYPE=mongodb` is the default).
- Adding the *next* module (e.g., `verification-request`) requires no further architectural design — only schema definitions and a sibling implementation file.

### Non-goals
- **Porting any other module.** Every other module (`claim`, `claim-review`, `users`, `review-task`, `events`, etc.) keeps its current Mongoose-only path. When `DB_TYPE=postgres`, those modules' endpoints continue to work *only if* the deployment also runs MongoDB — which is not the supported configuration. In practice, the personality slice is the only fully-functional surface under `DB_TYPE=postgres`.
- **Live dual-write or runtime DB switching.** One backend per process, decided at boot.
- **Mongo→Postgres data-migration tool.** Deferred to its own phase (see completion checklist Phase 10). Greenfield Postgres deployments only.
- **Real-Postgres CI parity job.** Tests run against pglite only.
- **Cross-collection methods on the personality slice** (`getClaimsByPersonalitySlug`, `getReviewStats`, `combinedListAll`, `extractClaimWithTextSummary`). These throw `NotImplementedError` on the Postgres backend until the dependent modules are ported.

---

## 2. Existing scaffolding (the starting point)

The codebase already contains the multi-DB stub pattern, applied only to `personality`:

| File | Role |
|---|---|
| `server/config/db.config.ts` | Hardcoded `{ type: "mongodb" }` — designed for env-driven override. |
| `server/app.module.ts:81-92` | `register()` switches on `options.db.type`. Currently throws on anything but `"mongodb"`. |
| `server/personality/personality.module.ts` | Dynamic module; conditionally registers Mongoose model + service when `dbConfig.type === "mongodb"`. |
| `server/personality/personality.provider.ts` | Factory provider that returns a `MongoPersonalityService` typed as `IPersonalityService`. |
| `server/interfaces/personality.service.interface.ts` | `IPersonalityService` type — 19 method signatures. |
| `server/personality/mongo/` | The existing Mongoose implementation, sibling-ready for a `postgres/` peer. |

**No PG dependencies in `package.json`. No Postgres code anywhere.** The stubs are scaffolding only.

`mongoose-softdelete-typescript` is in use on the `personality` schema (and on `claim` / `claim-review`, but those are out of scope here).

### Atlas-specific feature inventory (relevant to scope)

| Feature | Used by personality slice? | Replacement strategy |
|---|---|---|
| Atlas `$search` (fuzzy text) | **Yes** — `personality.service.ts:619-628`, fuzzy on `name` with `maxEdits: 1` | `pg_trgm` GIN index on `name`, `%` operator, `similarity()` for ranking |
| Atlas Vector Search / `$vectorSearch` | No (used in `verification-request` only) | `pgvector` (deferred; foundational layer enables it but slice doesn't exercise it) |
| Change streams | No (not used anywhere) | N/A |
| Transactions | No (not used anywhere) | Drizzle `db.transaction(...)` available, unused in slice |
| GridFS | No (S3 used) | N/A |
| Geospatial / time-series / discriminators | No | N/A |

The personality slice's only non-CRUD feature is the `$search` rewrite, which becomes a single trigram-indexed query.

---

## 3. Architecture

### 3.1 Directory layout

```
server/
├── config/
│   └── db.config.ts                      # extended: env-driven DB_TYPE
├── database/                             # NEW — foundational layer
│   ├── errors.ts                         # NotImplementedError, mapped to HTTP 501
│   ├── postgres/
│   │   ├── postgres.module.ts            # Nest dynamic module, forRoot(uri, poolSize)
│   │   ├── postgres.provider.ts          # DRIZZLE provider token
│   │   ├── connection.ts                 # pg.Pool factory + drizzle() wrapper
│   │   ├── schema/
│   │   │   └── index.ts                  # re-exports per-module schemas
│   │   └── README.md                     # public-surface enforcement note (see §3.5)
│   └── postgres-test/
│       └── pglite-factory.ts             # per-worker pglite + drizzle bootstrap
├── personality/
│   ├── postgres/                         # NEW — sibling to mongo/
│   │   ├── personality.service.ts        # implements IPersonalityService
│   │   └── schema/
│   │       └── personality.schema.ts     # Drizzle pgTable
│   ├── personality.module.ts             # extended: branch on DB_TYPE
│   ├── personality.provider.ts           # extended: branch on DB_TYPE
│   └── personality.service.type-test.ts  # NEW — exact-match compile-time test
└── tests/
    ├── per-worker-setup.ts               # extended: branch on DB_TYPE
    └── postgres-setup.ts                 # NEW — pglite per-worker bootstrap

drizzle.config.ts                         # NEW — drizzle-kit config
migrations-postgres/                      # NEW — drizzle-generated SQL files
   └── 0000_extensions.sql                # hand-written: pg_trgm, vector
```

### 3.2 Configuration plumbing

`config.yaml`:

```yaml
db:
  type: postgres                          # mongodb | postgres
  postgres:
    connection_uri: postgres://aletheia:aletheia@localhost:5432/aletheia
    pool_size: 10
    fuzzy_threshold: 0.3                  # pg_trgm similarity threshold
```

`server/config/db.config.ts`:

```typescript
export default {
    type: (process.env.DB_TYPE ?? "mongodb") as "mongodb" | "postgres",
};
```

`server/app.module.ts:81-92` (extended):

```typescript
if (options.db.type === "mongodb") {
    imports.push(MongooseModule.forRoot(options.db.connection_uri, options.db.options));
} else if (options.db.type === "postgres") {
    imports.push(PostgresModule.forRoot(options.db.postgres));
} else {
    throw new Error("Invalid DB_TYPE in configuration");
}
```

`dbConfig.type` is read at module construction time (already true today). Tests override `DB_TYPE` via env before NestJS bootstraps. No runtime switching.

### 3.3 Drizzle setup

**Connection** (`server/database/postgres/connection.ts`):

```typescript
import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export type DrizzleClient = NodePgDatabase<typeof schema>;

export function createPool(uri: string, poolSize: number): Pool {
    return new Pool({ connectionString: uri, max: poolSize });
}

export function createDrizzle(pool: Pool): DrizzleClient {
    return drizzle(pool, { schema });
}
```

**Provider token** (`server/database/postgres/postgres.provider.ts`):

```typescript
export const DRIZZLE = Symbol("DRIZZLE");
```

**Module** — `PostgresModule.forRoot({ connection_uri, pool_size, ... })` constructs the pool and Drizzle client and exposes them under the `DRIZZLE` token. Module services receive the client via `@Inject(DRIZZLE)`. No `@InjectRepository` decorator pattern — this matches the existing factory-provider convention in `personality.provider.ts`.

**Schema registration** — each module owns its Drizzle schema files under `<module>/postgres/schema/*.schema.ts`. The foundational layer's `database/postgres/schema/index.ts` re-exports them as a single barrel:

```typescript
// server/database/postgres/schema/index.ts
export * from "../../personality/postgres/schema/personality.schema";
// future: export * from "../../verification-request/postgres/schema/verification-request.schema";
```

Drizzle's `schema` argument (passed to `drizzle()`) is the single barrel — adding a new module is one re-export line plus one schema file.

**Migrations:**

- `drizzle.config.ts` writes generated SQL files into `migrations-postgres/`. **Separate from the existing `migrations/` directory** (used by `migrate-mongo`) — they never collide.
- `drizzle-kit generate` creates versioned `.sql` files committed to git.
- `drizzle-kit migrate` applies them. Surfaced as new yarn scripts:
  - `yarn migrate:pg` — apply pending Postgres migrations
  - `yarn migrate:pg:create <name>` — generate new migration from schema diff
  - `yarn migrate:pg:status` — show applied / pending
- The existing `yarn migrate` / `yarn migrate:create` / `yarn migrate:status` scripts stay Mongo-only.
- The first migration `0000_extensions.sql` is hand-written and installs `pg_trgm` and `vector`:
  ```sql
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

**Transactions:** `db.transaction(async (tx) => { ... })` is documented as the pattern but unused in the personality slice (Mongoose isn't using transactions either — confirmed by the audit).

**Soft delete:** Drizzle has no plugin equivalent for `mongoose-softdelete-typescript`. Replacement is explicit:

- Each soft-deleted table gets `is_deleted boolean not null default false` and `deleted_at timestamptz null`.
- A small helper `notDeleted(table)` returns `eq(table.isDeleted, false)`. All read queries call `.where(notDeleted(personality))`.
- `delete()` becomes `UPDATE ... SET is_deleted = true, deleted_at = now()`.
- Methods that explicitly query soft-deleted rows (e.g., `getDeletedPersonalityByWikidata`) filter `WHERE is_deleted = true`.

This is intentionally not a clever abstraction — a half-dozen `.where(notDeleted(...))` calls is cheaper to read than a plugin. If repetition becomes painful in later phases, a wrapped repository helper can be introduced then.

### 3.4 Personality slice

**Mongo schema today** (`server/personality/mongo/schemas/personality.schema.ts`):
- `name: string` (required)
- `slug: string` (required)
- `description: string` (required)
- `wikidata: string` (unique, sparse)
- `isHidden: boolean` (default false)
- `timestamps: true` → `createdAt`, `updatedAt`
- `softDeletePlugin` → `isDeleted`
- Virtual `claims` → reverse lookup into `Claim` collection by `personalities` field

**Drizzle table** (`server/personality/postgres/schema/personality.schema.ts`):

```typescript
import { pgTable, uuid, text, boolean, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const personality = pgTable("personality", {
    id:          uuid("id").primaryKey().defaultRandom(),
    name:        text("name").notNull(),
    slug:        text("slug").notNull(),
    description: text("description").notNull(),
    wikidata:    text("wikidata"),
    isHidden:    boolean("is_hidden").notNull().default(false),
    isDeleted:   boolean("is_deleted").notNull().default(false),
    deletedAt:   timestamp("deleted_at", { withTimezone: true }),
    createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
    wikidataUq:  uniqueIndex("personality_wikidata_uq").on(t.wikidata).where(sql`${t.wikidata} IS NOT NULL`),
    slugIdx:     index("personality_slug_idx").on(t.slug),
    nameTrgmIdx: index("personality_name_trgm_idx").using("gin", sql`${t.name} gin_trgm_ops`),
}));
```

Notes:
- **ID**: `uuid` with `gen_random_uuid()`. Mongo `_id` is not preserved — greenfield only. The deferred migration script (Phase 10) will map `ObjectId` → UUID deterministically (e.g., uuid v5 in a fixed namespace) when written.
- **Sparse unique on `wikidata`**: Postgres partial unique index `WHERE wikidata IS NOT NULL` matches Mongoose `unique: true, sparse: true`.
- **Trigram GIN index on `name`**: required for the fuzzy search rewrite below.
- **Timestamps**: explicit columns matching `timestamps: true`. App-side updates `updatedAt` on writes. Triggers are avoided to keep behavior identical between Postgres and pglite (pglite supports triggers but adding one means another thing to verify across environments).
- **`claims` virtual**: not represented — it's a relationship readable via join from the (future) `claim` table. Cross-collection methods that need it throw `NotImplementedError`.

**Fuzzy search rewrite.** Mongo today (`personality.service.ts:619-628`):

```javascript
{ $search: { index: "personality_fields", text: { query, path: "name", fuzzy: { maxEdits: 1 } } } }
```

Drizzle/Postgres equivalent:

```typescript
const matches = await db
    .select()
    .from(personality)
    .where(and(
        notDeleted(personality),
        sql`${personality.name} % ${query}`
    ))
    .orderBy(sql`similarity(${personality.name}, ${query}) DESC`)
    .limit(pageSize)
    .offset(skip);
```

The `%` operator hits the GIN trigram index. Default `pg_trgm.similarity_threshold = 0.3` is approximately equivalent to `maxEdits: 1` for short strings; we expose `db.postgres.fuzzy_threshold` in config so the test suite can pin it deterministically (`SET pg_trgm.similarity_threshold = ?` per session).

**Service skeleton** (`server/personality/postgres/personality.service.ts`):

```typescript
@Injectable()
export class PostgresPersonalityService implements IPersonalityService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    // Personality-only — full implementations:
    async create(data) { /* INSERT ... RETURNING */ }
    async getById(id, opts?) { /* SELECT WHERE id = ? AND not deleted */ }
    async getPersonalityBySlug(q) { /* SELECT WHERE slug = ? AND not deleted */ }
    async getDeletedPersonalityByWikidata(w) { /* SELECT WHERE wikidata = ? AND is_deleted = true */ }
    async findOrCreatePersonality(data) { /* SELECT then INSERT (no transaction; Mongo impl doesn't either) */ }
    async update(id, body) { /* UPDATE ... SET updated_at = now() RETURNING */ }
    async delete(id) { /* UPDATE SET is_deleted = true, deleted_at = now() */ }
    async hideOrUnhidePersonality(id, h, d) { /* UPDATE is_hidden = h */ }
    async listAll(...) { /* paginated SELECT, optional fuzzy filter */ }
    async findAll(opts) { /* same with searchText param using % operator */ }
    async count(query?) { /* SELECT count(*) */ }
    async verifyInputsQuery(q) { /* pure helper, port verbatim — no DB */ }

    // Wikidata methods — call WikidataService, no DB at all:
    async getWikidataEntities(...) { /* unchanged from Mongo impl */ }
    async getWikidataList(...) { /* unchanged from Mongo impl */ }

    // Cross-collection — explicit NotImplementedError until claim/claim-review ported:
    async getClaimsByPersonalitySlug() { throw new NotImplementedError("postgres", "getClaimsByPersonalitySlug"); }
    async getReviewStats()             { throw new NotImplementedError("postgres", "getReviewStats"); }
    async combinedListAll()            { throw new NotImplementedError("postgres", "combinedListAll"); }
    async extractClaimWithTextSummary(){ throw new NotImplementedError("postgres", "extractClaimWithTextSummary"); }
    async postProcess()                { /* port if backend-agnostic; else NotImplementedError */ }
}
```

`NotImplementedError` is a custom exception class introduced by this work (not the JavaScript built-in `Error`), defined in `server/database/errors.ts` and mapped to HTTP 501 by the existing `AllExceptionsFilter`. The error includes `{ backend: "postgres", method: "getClaimsByPersonalitySlug" }` so observability tools can track which deferred methods are being called in real traffic.

**Module wiring** — extend `personality.module.ts:30-40`:

```typescript
@Module({})
export class PersonalityModule {
    static register(): DynamicModule {
        const imports = [];
        const providers = [personalityServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(PersonalityModel);
            providers.push(MongoPersonalityService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresPersonalityService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }
        // ... rest unchanged
    }
}
```

`personality.provider.ts` factory adds the matching `postgres` branch:

```typescript
export const personalityServiceProvider: Provider = {
    provide: "PersonalityService",
    useFactory: (
        mongoService: MongoPersonalityService | null,
        pgService: PostgresPersonalityService | null,
    ): IPersonalityService => {
        if (dbConfig.type === "mongodb" && mongoService) return mongoService;
        if (dbConfig.type === "postgres" && pgService) return pgService;
        throw new Error("Invalid DB_TYPE in configuration");
    },
    inject: [
        { token: MongoPersonalityService, optional: true },
        { token: PostgresPersonalityService, optional: true },
    ],
};
```

Optional injection ensures the unused class isn't required at boot.

### 3.5 Public-surface enforcement

**Goal**: any new capability added to a resource must land in the `I*Service` interface first; both implementations stay in lock-step on the public API.

Three layers, each independently useful, jointly strong:

**Layer 1 — DI-level type firewall** (already in place via the existing factory provider). Consumers receive `IPersonalityService`, not the concrete class. Even if an implementation has extra public methods, they are not callable through the DI token.

**Layer 2 — Compile-time exact-match type test** (the real gate). One file per resource interface:

```typescript
// server/personality/personality.service.type-test.ts
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { MongoPersonalityService } from "./mongo/personality.service";
import type { PostgresPersonalityService } from "./postgres/personality.service";

type PublicSurface<T> = Omit<
    { [K in keyof T]: T[K] },
    "onModuleInit" | "onModuleDestroy" | "onApplicationBootstrap" | "onApplicationShutdown" | "beforeApplicationShutdown"
>;

type ExactlyImplements<C, I> =
    [Exclude<keyof PublicSurface<C>, keyof I>] extends [never]
        ? [Exclude<keyof I, keyof PublicSurface<C>>] extends [never]
            ? true
            : { __error: "interface has methods not on impl"; missing: Exclude<keyof I, keyof PublicSurface<C>> }
        : { __error: "impl exposes public methods not in interface"; extra: Exclude<keyof PublicSurface<C>, keyof I> };

const _mongo: ExactlyImplements<MongoPersonalityService, IPersonalityService> = true;
const _pg:    ExactlyImplements<PostgresPersonalityService, IPersonalityService> = true;
```

Mechanics:
- TypeScript `private` and `protected` members do not appear in `keyof T` — internals are excluded automatically.
- Constructor-injected fields (`private readonly db: DrizzleClient`) are private — excluded.
- The `Omit<...>` line whitelists Nest lifecycle hooks (alternatively, mark them `protected` on classes).
- If a developer adds a public method to either implementation without updating the interface, `yarn build-ts` fails with a readable error pointing at the offending key (e.g., `extra: "fancyPgOnlyMethod"`).
- This file is included in the `tsc --noEmit` step that runs in pre-commit and CI — no extra tooling needed.

**Layer 3 — Convention** (`server/database/postgres/README.md`):

> To add a capability to a resource interface:
> 1. Update the `I*Service` interface in `server/interfaces/`.
> 2. Implement it in *both* `mongo/` and `postgres/`.
> 3. The corresponding `*.service.type-test.ts` must compile.
>
> Don't add public methods anywhere else. Helpers are `private` or `protected`.

**Per-phase requirement.** The completion checklist requires every new resource interface to ship with its own `*.service.type-test.ts`. This makes the rule scale.

**Caveat.** This enforces *shape* (method names + signatures), not *semantics*. Two implementations can have matching signatures and divergent behavior — that's what the contract test suite (§4.2) catches.

---

## 4. Test harness and CI

### 4.1 pglite per-worker bootstrap

pglite is in-process (no TCP port), so the existing `MONGO_URI` env-var pattern doesn't transfer directly. Each Vitest worker is a separate Node process — total isolation by construction.

```typescript
// server/tests/postgres-setup.ts
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../database/postgres/schema";

let cached: ReturnType<typeof drizzle> | null = null;

export async function getTestDrizzle() {
    if (cached) return cached;
    const pg = await PGlite.create({ extensions: { vector } });
    await pg.exec("CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE EXTENSION IF NOT EXISTS vector;");
    cached = drizzle(pg, { schema });
    await migrate(cached, { migrationsFolder: "migrations-postgres" });
    return cached;
}

export async function resetTestDrizzle() {
    // TRUNCATE all tables in dependency order; faster than re-running migrations.
}
```

`resetTestDrizzle()` runs in `beforeEach` to wipe rows without re-running migrations.

**Test wiring** — in `personality.e2e.spec.ts`, the NestJS `Test.createTestingModule()` overrides the `DRIZZLE` provider with the test client when `DB_TYPE=postgres`. The existing Mongo tests are untouched.

### 4.2 Contract tests + backend-specific tests

- **Pure-CRUD tests** (`create`, `getById`, `update`, `delete`, `findOrCreate`, `count`, `hideOrUnhidePersonality`, `getPersonalityBySlug`) → factored into `personality-contract.spec.ts` that takes an `IPersonalityService` factory and runs the same assertions against either backend. Catches drift. The Mongo backend continues to receive the same test coverage it has today (the same assertions, executed via the contract suite); the existing `personality.e2e.spec.ts` keeps any tests that genuinely depend on Mongoose-specific behavior, or is left as a thin re-export of the contract suite if nothing remains backend-specific.
- **Backend-specific tests** stay in their own files:
  - `personality.mongo.spec.ts` — Atlas `$search` semantics
  - `personality.postgres.spec.ts` — trgm threshold tuning, GIN index sanity
- **`NotImplementedError` methods** — asserted to throw on Postgres backend, asserted to return data on Mongo backend.

**Caveat on contract tests for fuzzy search.** Atlas `$search` and `pg_trgm` produce different *scores*. Contract tests focus on which records match (set-equality, ordering by a deterministic field like `slug`), not on exact scores or ranking ties.

### 4.3 CI matrix

`.github/workflows/nodejs.yml` changes:

| Job | Status | DB_TYPE | Notes |
|---|---|---|---|
| `vitest` (existing) | unchanged | `mongodb` (default) | Runs all existing tests, including Mongo-backed personality tests. |
| `cypress-run-ferretdb` (existing) | unchanged | n/a | Tests against FerretDB. |
| `vitest-postgres` (new) | added | `postgres` | Runs same `yarn test` with `DB_TYPE=postgres`. No service container needed (pglite is in-process). Only the personality tests + foundational-layer tests run; other modules are gated to skip when on Postgres backend (see §4.4). |

Total CI overhead: ~1–2 min. No real-Postgres parity job — pglite-only by user decision.

### 4.4 Test scoping for the postgres job

Two mechanisms for gating tests by backend:

- **Filename convention** for backend-specific tests: `*.mongo.spec.ts`, `*.postgres.spec.ts`. Each Vitest project config picks its files via glob.
- **`describe.skipIf(process.env.DB_TYPE !== "postgres")`** for tests that should run only on one backend but live in a shared file (rare; prefer the filename split).

As more modules are ported, more tests are tagged in. The contract test files (`*-contract.spec.ts`) run on both backends.

---

## 5. New dependencies

`package.json` additions:

```json
{
  "dependencies": {
    "drizzle-orm": "^0.36.0",
    "pg": "^8.13.0",
    "@types/pg": "^8.11.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.28.0",
    "@electric-sql/pglite": "^0.2.0"
  }
}
```

(Exact versions to be pinned at implementation time against current latest stable.)

No removals. No changes to existing Mongoose / mongodb-memory-server / migrate-mongo-ts deps.

---

## 6. Failure modes and operational notes

- **Boot-time misconfig**: invalid `DB_TYPE` throws a clear error at module construction, before the HTTP server starts. Same as today.
- **Migration drift**: `drizzle-kit migrate` is not run automatically at boot in production (mirrors current `migrate-mongo` operational model — operators run `yarn migrate:pg` as part of deployment). In tests it runs on first pglite use per worker.
- **Calling a `NotImplementedError` method on Postgres**: HTTP 501 with a structured payload (`{ backend, method }`). Front-end gracefully degrades for cross-collection queries until those modules are ported.
- **pglite vs real Postgres divergence**: not protected against in CI (no parity job per user decision). The risk surface is small for the personality slice (vanilla SQL, `pg_trgm` is built into pglite). Future phases that lean on more advanced features (logical replication, advanced FTS, `pgvector` HNSW indexes) may want to revisit.

---

## 7. Out of scope (explicitly)

- Porting any non-personality module.
- Mongo→Postgres data migration tooling.
- Real-Postgres CI parity.
- Removing Mongoose, FerretDB, or `migrate-mongo`.
- Live dual-write or runtime DB switching.
- Performance benchmarking vs Mongo.

These are tracked in the [completion checklist](./2026-05-10-postgres-completion-checklist.md).

---

## 8. Acceptance criteria

The work is done when all of these pass:

1. `yarn build-ts` succeeds with the new `*.service.type-test.ts` files in place.
2. `yarn migrate:pg` against a fresh Postgres 16 database creates the `personality` table with all indexes and extensions.
3. `DB_TYPE=postgres yarn dev` boots and serves `GET /personality/:slug` (CRUD endpoints functional).
4. `DB_TYPE=mongodb yarn test` passes with no coverage regression — the contract suite (§4.2) covers the same surface as the prior pure-CRUD tests, and any genuinely Mongo-specific tests retained in `personality.mongo.spec.ts` continue to pass.
5. `DB_TYPE=postgres yarn test` passes (new pglite-backed tests for the personality slice).
6. CI runs both `vitest` and `vitest-postgres` on every PR.
7. The fuzzy search endpoint returns the same record sets on both backends for a representative test corpus (within accepted scoring divergence — see §4.2).
8. Calling `getClaimsByPersonalitySlug` on `DB_TYPE=postgres` returns HTTP 501 with the structured `NotImplementedError` payload.
9. The Mongo-backed personality test suite continues to pass.
10. A new dev can read `server/database/postgres/README.md` and add a stub for a second module's resource interface without further design.
