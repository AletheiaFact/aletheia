import type { Config } from "drizzle-kit";

/**
 * drizzle-kit configuration. Reads POSTGRES_URL from the environment (typically
 * via `.env` loaded by env-cmd in the yarn scripts). Falls back to a local
 * docker-compose-shaped default for convenience during dev. In production the
 * env var is expected to be set explicitly — drizzle-kit migration commands
 * will surface a clear connection error if it isn't.
 */
const url =
    process.env.POSTGRES_URL ??
    "postgres://aletheia:aletheia@localhost:5432/aletheia";

const config: Config = {
    dialect: "postgresql",
    schema: "./server/database/postgres/schema/index.ts",
    out: "./migrations-postgres",
    dbCredentials: { url },
};
export default config;
