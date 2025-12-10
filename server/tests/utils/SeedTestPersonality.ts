import { MongoClient } from "mongodb";
import { PersonalitiesMock } from "./PersonalitiesMock";

export const SeedTestPersonality = async (uri) => {
    const client = await new MongoClient(uri);
    await client.connect();

    try {
        // Use bulkWrite with upsert to avoid duplicate errors in parallel execution
        const operations = PersonalitiesMock.map((personality) => ({
            updateOne: {
                filter: { slug: personality.slug },
                update: { $set: personality },
                upsert: true,
            },
        }));

        const result = await client
            .db("test")
            .collection("personalities")
            .bulkWrite(operations);

        // Get the inserted/updated IDs
        const personalities = await client
            .db("test")
            .collection("personalities")
            .find({ slug: { $in: PersonalitiesMock.map((p) => p.slug) } })
            .toArray();

        return {
            insertedIds: personalities.reduce((acc, p, index) => {
                acc[index.toString()] = p._id;
                return acc;
            }, {}),
            acknowledged: result.ok === 1,
        };
    } finally {
        await client.close();
    }
};
