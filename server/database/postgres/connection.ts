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
