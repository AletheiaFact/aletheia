import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
    console.log('\n🚀 Starting shared MongoMemoryServer...');

    const instance = await MongoMemoryServer.create({
        instance: {
            dbName: 'jest-test',
        },
    });

    const uri = instance.getUri();

    // Store instance globally for teardown
    (global as any).__MONGOINSTANCE = instance;

    // Store URI in environment for all tests to use
    process.env.MONGO_URI = uri;

    console.log(`✅ MongoDB ready at: ${uri}\n`);
}
