import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Global setup for Jest test suite
 * Creates a shared MongoMemoryServer instance for all test suites
 * to improve performance and reduce resource usage
 */
export default async function globalSetup() {
    const instance = await MongoMemoryServer.create({
        instance: {
            dbName: "jest-test",
        },
    });

    const uri = instance.getUri();

    // Store instance globally for teardown
    (global as any).__MONGOINSTANCE = instance;

    // Store URI in environment for all tests to use
    process.env.MONGO_URI = uri;
}
