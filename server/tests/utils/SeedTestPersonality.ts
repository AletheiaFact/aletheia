import { MongoClient } from "mongodb";
import { PersonalitiesMock } from "./PersonalitiesMock";
import { getTestDbName } from "./getTestDbName";

export const SeedTestPersonality = async (uri: string) => {
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
            .db(getTestDbName(uri))
            .collection("personalities")
            .bulkWrite(operations);

        // Get the inserted/updated IDs with explicit ordering for consistency
        const personalities = await client
            .db(getTestDbName(uri))
            .collection("personalities")
            .find({ slug: { $in: PersonalitiesMock.map((p) => p.slug) } })
            .sort({ slug: 1 })
            .toArray();

        // Map by slug to ensure order-independent ID mapping
        return {
            insertedIds: PersonalitiesMock.reduce((acc, mock, index) => {
                const personality = personalities.find(
                    (p) => p.slug === mock.slug
                );
                if (personality) {
                    acc[index.toString()] = personality._id;
                }
                return acc;
            }, {} as Record<string, any>),
            acknowledged: result.ok === 1,
        };
    } finally {
        await client.close();
    }
};
