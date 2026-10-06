import { customType } from "drizzle-orm/pg-core";

// Dimensionless pgvector column: the embedding model (and so the dimension)
// is deployment config, not schema. A typmod + HNSW index land at cutover
// once the model is pinned (docs/postgres-migration-foundation.md §7).
export const vector = customType<{ data: number[]; driverData: string }>({
    dataType() {
        return "vector";
    },
    toDriver(value: number[]): string {
        return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
        return value
            .slice(1, -1)
            .split(",")
            .filter((v) => v !== "")
            .map(Number);
    },
});
