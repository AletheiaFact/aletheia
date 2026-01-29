/**
 * Global teardown for Jest test suite
 * Stops the shared MongoMemoryServer instance created in globalSetup
 */
export default async function globalTeardown() {
    const instance = (global as any).__MONGOINSTANCE;

    if (instance) {
        await instance.stop();
    }
}
