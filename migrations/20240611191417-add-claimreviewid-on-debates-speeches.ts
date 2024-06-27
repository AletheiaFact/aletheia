import { Db } from "mongodb";

export async function up(db: Db) {
    const collection = db.collection("speeches");

    const pipeline = [
        {
            $lookup: {
                from: "debates",
                localField: "_id",
                foreignField: "content",
                as: "debate",
            },
        },
        {
            $lookup: {
                from: "claimrevisions",
                localField: "debate._id",
                foreignField: "contentId",
                as: "claimRevisions",
            },
        },
        {
            $unwind: "$claimRevisions",
        },
        {
            $addFields: {
                claimRevisionId: "$claimRevisions._id",
            },
        },
    ];

    const speechesWithClaimRevision = await collection
        .aggregate(pipeline)
        .toArray();

    for (const speeche of speechesWithClaimRevision) {
        await collection.updateOne(
            { _id: speeche._id },
            { $set: { claimRevisionId: speeche.claimRevisionId } }
        );
    }
}

export async function down(db: Db) {
    const collection = db.collection("speeches");

    await collection.updateMany(
        { claimRevisionId: { $exists: true } },
        { $unset: { claimRevisionId: "" } }
    );
}
