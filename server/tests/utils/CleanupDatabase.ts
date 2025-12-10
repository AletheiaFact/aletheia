import { MongoClient } from "mongodb";

/**
 * Cleanup utility to clear database collections between test suites
 * This prevents duplicate key errors when running tests sequentially
 */
export async function CleanupDatabase(mongoUri: string): Promise<void> {
    const client = await MongoClient.connect(mongoUri);

    try {
        const db = client.db("test");
        const collections = await db.listCollections().toArray();

        // Drop all collections to ensure clean state
        for (const collection of collections) {
            await db.collection(collection.name).deleteMany({});
        }

        console.log(`✅ Cleaned up ${collections.length} collections`);
    } catch (error) {
        console.error('❌ Database cleanup failed:', error);
    } finally {
        await client.close();
    }
}
