import { MongoClient } from "mongodb";
import { getTestDbName } from "./getTestDbName";

/**
 * Cleanup utility to clear database collections between test suites
 * This prevents duplicate key errors when running tests sequentially
 *
 * @param mongoUri - MongoDB connection URI
 * @throws Error if database cleanup fails
 */
export async function CleanupDatabase(mongoUri: string): Promise<void> {
    const client = await MongoClient.connect(mongoUri);
    const dbName = getTestDbName(mongoUri);

    try {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();

        // Delete all documents from all collections to ensure clean state
        for (const collection of collections) {
            await db.collection(collection.name).deleteMany({});
        }
    } catch (error) {
        throw new Error(
            `Database cleanup failed for ${dbName}: ${
                error instanceof Error ? error.message : String(error)
            }`
        );
    } finally {
        await client.close();
    }
}
