import { Provider, Type } from "@nestjs/common";
import dbConfig from "../config/db.config";
import { DB_METRICS_ENV, withDbMetrics } from "./db-metrics";

/**
 * Builds the per-module provider that selects the Mongo or Postgres service
 * implementation behind a string token at boot time (`DB_TYPE`, one process
 * one backend — docs/postgres-migration-foundation.md §1.2). The module's
 * register() only provides the class matching dbConfig.type, so the other
 * inject slot resolves to null via `optional: true`.
 */
export function createDbServiceProvider<TInterface>(
    token: string,
    mongoClass: Type<unknown>,
    postgresClass: Type<unknown>
): Provider {
    return {
        provide: token,
        useFactory: (mongoService: unknown, pgService: unknown): TInterface => {
            const metrics = Boolean(process.env[DB_METRICS_ENV]);
            const pick = (service: object): TInterface =>
                (metrics
                    ? withDbMetrics(token, dbConfig.type, service)
                    : service) as TInterface;
            if (dbConfig.type === "mongodb" && mongoService) {
                return pick(mongoService as object);
            }
            if (dbConfig.type === "postgres" && pgService) {
                return pick(pgService as object);
            }
            throw new Error("Invalid DB_TYPE in configuration");
        },
        inject: [
            { token: mongoClass, optional: true } as any,
            { token: postgresClass, optional: true } as any,
        ],
    };
}
