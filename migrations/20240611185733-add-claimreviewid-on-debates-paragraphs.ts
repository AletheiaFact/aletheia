import { Db } from "mongodb";

export async function up(db: Db) {
    const collection = db.collection("paragraphs");

    const pipeline = [
        {
            $lookup: {
                from: "speeches",
                localField: "_id",
                foreignField: "content",
                as: "speeches",
            },
        },
        {
            $unwind: "$speeches",
        },
        {
            $lookup: {
                from: "debates",
                localField: "speeches._id",
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
