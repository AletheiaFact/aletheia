import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const collection = db.collection("paragraphs");

    const pipeline = [
        {
            $lookup: {
                from: "unattributeds",
                localField: "_id",
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

    const paragraphsWithClaimRevision = await collection
        .aggregate(pipeline)
        .toArray();

    for (const paragraph of paragraphsWithClaimRevision) {
        await collection.updateOne(
            { _id: paragraph._id },
            { $set: { claimRevisionId: paragraph.claimRevisionId } }
        );
    }
}

export async function down(db: Db) {
    const collection = db.collection("paragraphs");

    await collection.updateMany(
        { claimRevisionId: { $exists: true } },
        { $unset: { claimRevisionId: "" } }
    );
}
