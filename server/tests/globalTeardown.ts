export default async function globalTeardown() {
    console.log('\n🛑 Stopping MongoMemoryServer...');

    const instance = (global as any).__MONGOINSTANCE;

    if (instance) {
        await instance.stop();
        console.log('✅ MongoMemoryServer stopped.\n');
    }
}
