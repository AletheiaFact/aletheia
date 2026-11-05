import { MongoClient } from "mongodb";
import { oprahWikidataId, wikidataCacheProps } from "../fixtures/wikidata";

// Seeds the server's wikidata cache (WikidataCache schema) so personality
// pages render without the server calling wikidata.org.
const seedWikidataCache = async (): Promise<null> => {
    const uri = process.env.CI_MONGODB_URI;
    if (!uri) {
        throw new Error("CI_MONGODB_URI is required to seed the wikidata cache");
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const cache = client.db().collection("wikidatacaches");
        const now = new Date();
        await Promise.all(
            Object.entries(wikidataCacheProps).map(([language, props]) =>
                cache.updateOne(
                    { wikidataId: oprahWikidataId, language },
                    {
                        $set: { props },
                        $setOnInsert: { createdAt: now },
                        $currentDate: { updatedAt: true },
                    },
                    { upsert: true }
                )
            )
        );
        return null;
    } finally {
        await client.close();
    }
};

const plugin = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    on("task", { seedWikidataCache });
    return config;
};

export default plugin;
