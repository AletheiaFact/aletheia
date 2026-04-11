/**
 * Extracts the database name from a MongoDB connection URI.
 *
 * Used by seed and cleanup utilities to ensure they target the SAME database
 * that the application code (Mongoose) is using. Previously the test
 * utilities hardcoded `"test"` as the database name, which broke per-worker
 * isolation when each Vitest worker uses its own DB (e.g.,
 * `mongodb://127.0.0.1:PORT/test-worker-1`).
 *
 * Falls back to `"test"` if the URI has no database segment.
 */
export const getTestDbName = (uri: string): string => {
    try {
        const url = new URL(uri);
        const dbName = url.pathname.replace(/^\//, "");
        return dbName || "test";
    } catch {
        return "test";
    }
};
