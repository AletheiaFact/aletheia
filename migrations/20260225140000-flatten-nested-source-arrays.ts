import { Db } from "mongodb";

export async function up(db: Db) {
    const vrCollection = db.collection("verificationrequests");

    const docsWithNestedSource = await vrCollection
        .find({ "source.0": { $type: "array" } })
        .toArray();

    for (const doc of docsWithNestedSource) {
        const flattened = doc.source.flat();
        await vrCollection.updateOne(
            { _id: doc._id },
            {
                $set: { source: flattened },
            }
        );
    }

    console.log(
        `Flattened nested source arrays in ${docsWithNestedSource.length} verification requests`
    );
}
