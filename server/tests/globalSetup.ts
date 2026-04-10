import { MongoMemoryServer } from "mongodb-memory-server";
import type { TestProject } from "vitest/node";

/**
 * Global setup for the Vitest test suite.
 *
 * Creates a single shared MongoMemoryServer instance for all test workers and
 * exposes its base URI to workers via Vitest's `provide()` API. Each worker
 * (see `server/tests/per-worker-setup.ts`) then constructs its own per-worker
 * database name on top of this shared instance, so concurrent e2e tests do
 * not race on the same collections.
 */
export async function setup({ provide }: TestProject) {
    const instance = await MongoMemoryServer.create();

    // Expose the base URI to test workers. The trailing slash is significant
    // because per-worker-setup.ts appends a database name directly.
    provide("mongoBaseUri", instance.getUri());

    // Return teardown function (Vitest 4 globalSetup pattern). Stops the
    // mongod child process so the test process can exit cleanly without
    // requiring `forceExit: true`.
    return async () => {
        await instance.stop();
    };
}

declare module "vitest" {
    export interface ProvidedContext {
        mongoBaseUri: string;
    }
}
