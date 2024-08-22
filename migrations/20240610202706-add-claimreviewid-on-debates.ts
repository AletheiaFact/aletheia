import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const collection = db.collection("debates");

    const pipeline = [
        {
            $lookup: {
                from: "claimrevisions",
                localField: "_id",
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

    const debatesWithClaimRevision = await collection
        .aggregate(pipeline)
        .toArray();

    for (const debates of debatesWithClaimRevision) {
        await collection.updateOne(
            { _id: debates._id },
            { $set: { claimRevisionId: debates.claimRevisionId } }
        );
    }
}

export async function down(db: Db) {
    const collection = db.collection("debates");

    await collection.updateMany(
        { claimRevisionId: { $exists: true } },
        { $unset: { claimRevisionId: "" } }
    );
}
