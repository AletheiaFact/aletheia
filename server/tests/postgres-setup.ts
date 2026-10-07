import { PGlite } from "@electric-sql/pglite";
// @ts-expect-error — TS moduleResolution=node10 cannot resolve subpath exports;
// types exist at dist/vector/index.d.ts and the subpath works at runtime.
import { vector } from "@electric-sql/pglite/vector";
// @ts-expect-error — TS moduleResolution=node10 cannot resolve subpath exports;
// types exist at dist/contrib/pg_trgm.d.ts and the subpath works at runtime.
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { migrate as migrateNodePg } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { sql, getTableName, isTable } from "drizzle-orm";
import * as schema from "../database/postgres/schema";

// TEST_POSTGRES_URL switches the rail from in-process pglite to a real server
// (the vitest-postgres-real CI job): same migrations, same reset, real
// extension availability, partial indexes and pool semantics.
export const TEST_POSTGRES_URL = process.env.TEST_POSTGRES_URL;

// Workers share the server but not a database: each one gets
// `<db>_w<VITEST_POOL_ID>` (created on first use), like the per-worker Mongo
// databases, so TRUNCATEs never cross workers.
async function createWorkerDatabase(baseUrl: string): Promise<string> {
    const url = new URL(baseUrl);
    const baseName = url.pathname.replace(/^\//, "") || "postgres";
    const workerName = `${baseName}_w${process.env.VITEST_POOL_ID ?? "0"}`;
    const admin = new Pool({ connectionString: baseUrl, max: 1 });
    try {
        const { rows } = await admin.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [workerName]
        );
        if (rows.length === 0) {
            await admin.query(`CREATE DATABASE "${workerName}"`);
        }
    } finally {
        await admin.end();
    }
    url.pathname = `/${workerName}`;
    return url.toString();
}

// Module-private cache. Each Vitest worker is a separate process, so this
// singleton gives every worker its own pglite instance — no cross-worker
// contention. `resetTestDrizzle` cleans rows between tests within a worker.
//
// `ReturnType<typeof getTestDrizzle>` would self-reference the function's
// inferred return type, and `ReturnType<typeof drizzle<typeof schema>>` is
// rejected by Prettier 2.3.2 (no support for TS 4.7+ instantiation
// expressions). A helper module-private getter lets TS infer the type from a
// concrete call expression, which Prettier parses fine.
const _typeProbe = () => drizzle({} as PGlite, { schema });
let cached: ReturnType<typeof _typeProbe> | null = null;

export async function getTestDrizzle(): Promise<ReturnType<typeof _typeProbe>> {
    if (cached) return cached;
    if (TEST_POSTGRES_URL) {
        const pool = new Pool({
            connectionString: await createWorkerDatabase(TEST_POSTGRES_URL),
            max: 4,
        });
        const db = drizzleNodePg(pool, { schema });
        await migrateNodePg(db, { migrationsFolder: "migrations-postgres" });
        cached = db as unknown as ReturnType<typeof _typeProbe>;
        return cached;
    }
    const pg = await PGlite.create({ extensions: { vector, pg_trgm } });
    await pg.exec(
        "CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE EXTENSION IF NOT EXISTS vector;"
    );
    const db = drizzle(pg, { schema });
    await migrate(db, { migrationsFolder: "migrations-postgres" });
    cached = db;
    return db;
}

/**
 * Truncate every table the schema knows about. Cheaper than re-running migrations
 * between tests. Order doesn't matter when CASCADE is used.
 *
 * Always connects first: on the real rail the worker database outlives the
 * test file, so a reset that skipped when this module had no connection yet
 * would leak the previous file's rows into the next one.
 */
export async function resetTestDrizzle() {
    const db = await getTestDrizzle();
    const tables = Object.values(schema)
        .filter((v: any) => isTable(v))
        .map((t: any) => `"${getTableName(t)}"`);
    if (tables.length === 0) return;
    await db.execute(
        sql.raw(`TRUNCATE ${tables.join(", ")} RESTART IDENTITY CASCADE;`)
    );
}
