import { Db } from "mongodb";

export async function up(db: Db) {
    const vrCollection = db.collection("verificationrequests");

    const allDocs = await vrCollection
        .find({ source: { $type: "objectId" } })
        .toArray();

    for (const doc of allDocs) {
        await vrCollection.updateOne(
            { _id: doc._id },
            { $set: { source: [doc.source] } }
        );
    }
}
