import { MongoClient } from "mongodb";
import { WIKIMEDIA_MOCK_PORT } from "../fixtures/wikidata";
import { startWikimediaMock, wikimediaMockTasks } from "./wikimediaMock";

const withDb = async <T>(
    fn: (db: ReturnType<MongoClient["db"]>) => Promise<T>
) => {
    const uri = process.env.CI_MONGODB_URI;
    if (!uri) {
        throw new Error("CI_MONGODB_URI is required for database tasks");
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        return await fn(client.db());
    } finally {
        await client.close();
    }
};

// The server caches Wikidata answers (wikidatacaches). A spec that changes
// what the mock answers for an item clears that item's cache first, so the
// server asks the mock again.
const clearWikidataCache = (wikidataId: string): Promise<null> =>
    withDb(async (db) => {
        await db.collection("wikidatacaches").deleteMany({ wikidataId });
        return null;
    });

const countWikidataCache = (wikidataId: string): Promise<number> =>
    withDb((db) =>
        db.collection("wikidatacaches").countDocuments({ wikidataId })
    );

// Inserts a personality straight into the database, for shapes the UI cannot
// create (for example one without a Wikidata id).
const seedPersonality = (personality: {
    name: string;
    slug: string;
    description: string;
    wikidata?: string;
}): Promise<null> =>
    withDb(async (db) => {
        const now = new Date();
        await db.collection("personalities").updateOne(
            { slug: personality.slug },
            {
                $set: {
                    ...personality,
                    isHidden: false,
                    isDeleted: false,
                    deletedAt: null,
                    updatedAt: now,
                },
                $setOnInsert: { createdAt: now },
            },
            { upsert: true }
        );
        return null;
    });

const removePersonality = (slug: string): Promise<null> =>
    withDb(async (db) => {
        await db.collection("personalities").deleteMany({ slug });
        return null;
    });

const plugin = (
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
) => {
    startWikimediaMock(WIKIMEDIA_MOCK_PORT);
    on("task", {
        ...wikimediaMockTasks,
        clearWikidataCache,
        countWikidataCache,
        seedPersonality,
        removePersonality,
    });
    return config;
};

export default plugin;
