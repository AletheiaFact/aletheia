import { MongoClient } from "mongodb";
import { oprahWikidataId, wikidataCacheProps } from "../fixtures/wikidata";

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

// Writes the cached props (WikidataCache schema) of one Wikidata id for each
// language, so the server answers from the cache and never calls wikidata.org.
const setWikidataCache = ({
    wikidataId,
    propsByLanguage,
}: {
    wikidataId: string;
    propsByLanguage: Record<string, Record<string, unknown>>;
}): Promise<null> =>
    withDb(async (db) => {
        const cache = db.collection("wikidatacaches");
        const now = new Date();
        await Promise.all(
            Object.entries(propsByLanguage).map(([language, props]) =>
                cache.updateOne(
                    { wikidataId, language },
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
    });

// Seeds the server's wikidata cache so personality pages render without the
// server calling wikidata.org.
const seedWikidataCache = (): Promise<null> =>
    setWikidataCache({
        wikidataId: oprahWikidataId,
        propsByLanguage: wikidataCacheProps,
    });

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
    on("task", {
        seedWikidataCache,
        setWikidataCache,
        seedPersonality,
        removePersonality,
    });
    return config;
};

export default plugin;
