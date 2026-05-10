import type { Config } from "drizzle-kit";

const isCI = process.env.CI === "true" || process.env.NODE_ENV === "production";
const url =
    process.env.POSTGRES_URL ??
    (isCI ? null : "postgres://aletheia:aletheia@localhost:5432/aletheia");
if (!url) {
    throw new Error("POSTGRES_URL must be set in CI/production environments");
}

const config: Config = {
    dialect: "postgresql",
    schema: "./server/database/postgres/schema/index.ts",
    out: "./migrations-postgres",
    dbCredentials: { url },
};
export default config;
