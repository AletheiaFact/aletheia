import { Db } from "mongodb";

export async function up(db: Db) {
    const vrCollection = db.collection("verificationrequests");

    const docsWithNestedTopics = await vrCollection
        .find({ "topics.0": { $type: "array" } })
        .toArray();

    for (const doc of docsWithNestedTopics) {
        const flattened = doc.topics.flat();
        await vrCollection.updateOne(
            { _id: doc._id },
            {
                $set: { topics: flattened },
            }
        );
    }

    console.log(
        `Flattened nested topics arrays in ${docsWithNestedTopics.length} verification requests`
    );
}
