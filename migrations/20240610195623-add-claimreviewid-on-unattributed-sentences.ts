import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const collection = db.collection("sentences");

    const pipeline = [
        {
            $lookup: {
                from: "paragraphs",
                localField: "_id",
                foreignField: "content",
                as: "paragraphs",
            },
        },
        {
            $unwind: "$paragraphs",
        },
        {
            $lookup: {
                from: "unattributeds",
                localField: "paragraphs._id",
                foreignField: "content",
                as: "unattributed",
            },
        },
        {
            $lookup: {
                from: "claimrevisions",
                localField: "unattributed._id",
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

    const sentencesWithClaimRevision = await collection
        .aggregate(pipeline)
        .toArray();

    for (const sentence of sentencesWithClaimRevision) {
        await collection.updateOne(
            { _id: sentence._id },
            { $set: { claimRevisionId: sentence.claimRevisionId } }
        );
    }
}

export async function down(db: Db) {
    const collection = db.collection("sentences");

    await collection.updateMany(
        { claimRevisionId: { $exists: true } },
        { $unset: { claimRevisionId: "" } }
    );
}
