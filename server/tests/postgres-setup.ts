import { PGlite } from "@electric-sql/pglite";
// @ts-expect-error — TS moduleResolution=node10 cannot resolve subpath exports;
// types exist at dist/vector/index.d.ts and the subpath works at runtime.
import { vector } from "@electric-sql/pglite/vector";
// @ts-expect-error — TS moduleResolution=node10 cannot resolve subpath exports;
// types exist at dist/contrib/pg_trgm.d.ts and the subpath works at runtime.
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { sql, getTableName, isTable } from "drizzle-orm";
import * as schema from "../database/postgres/schema";

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
 */
export async function resetTestDrizzle() {
    if (!cached) return;
    const tables = Object.values(schema)
        .filter((v: any) => isTable(v))
        .map((t: any) => `"${getTableName(t)}"`);
    if (tables.length === 0) return;
    await cached.execute(
        sql.raw(`TRUNCATE ${tables.join(", ")} RESTART IDENTITY CASCADE;`)
    );
}
