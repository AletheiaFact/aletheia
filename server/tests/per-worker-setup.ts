import { inject } from "vitest";

/**
 * Per-worker test setup file (referenced from `vitest.config.ts` e2e project).
 *
 * Each Vitest worker process runs this file once before its test files. It
 * reads the shared MongoMemoryServer base URI provided by `globalSetup.ts`
 * and constructs a unique-per-worker database name so concurrent workers do
 * not share Mongo collections.
 *
 * `VITEST_WORKER_ID` is set by Vitest on each worker process and is unique
 * per isolated worker (1..maxWorkers). This is the per-worker isolation
 * mechanism that lets the e2e suite run in parallel safely.
 */
const baseUri = inject("mongoBaseUri");
const workerId = process.env.VITEST_WORKER_ID || "1";

// mongodb-memory-server's getUri() returns a URI with a trailing slash, so
// appending the database name directly produces a valid connection string.
process.env.MONGO_URI = `${baseUri}test-worker-${workerId}`;
