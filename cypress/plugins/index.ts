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

// Adds a name the AI "could not match" to the first verification request and
// returns that request's id. Specs that need it must run after
// verificationRequest.cy.ts, which creates the request.
const seedUnmatchedPersonality = (name: string): Promise<string> =>
    withDb(async (db) => {
        const result: any = await db
            .collection("verificationrequests")
            .findOneAndUpdate(
                {},
                { $set: { unmatchedPersonalities: [{ name }] } },
                { returnDocument: "after" }
            );
        // The driver returns the document (v6) or { value } (older drivers).
        const request = result?.value ?? result;
        if (!request?._id) {
            throw new Error(
                "seedUnmatchedPersonality: no verification request exists; run it after verificationRequest.cy.ts"
            );
        }
        return String(request._id);
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
        seedUnmatchedPersonality,
    });
    return config;
};

export default plugin;
