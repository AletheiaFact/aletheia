import { Db } from "mongodb";

export async function up(db: Db) {
    const collection = db.collection("interviews");

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

    const interviewsWithClaimRevision = await collection
        .aggregate(pipeline)
        .toArray();

    for (const interviews of interviewsWithClaimRevision) {
        await collection.updateOne(
            { _id: interviews._id },
            { $set: { claimRevisionId: interviews.claimRevisionId } }
        );
    }
}

export async function down(db: Db) {
    const collection = db.collection("interviews");

    await collection.updateMany(
        { claimRevisionId: { $exists: true } },
        { $unset: { claimRevisionId: "" } }
    );
}
