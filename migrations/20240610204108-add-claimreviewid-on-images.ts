import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const collection = db.collection("images");

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

    const imagesWithClaimRevision = await collection
        .aggregate(pipeline)
        .toArray();

    for (const images of imagesWithClaimRevision) {
        await collection.updateOne(
            { _id: images._id },
            { $set: { claimRevisionId: images.claimRevisionId } }
        );
    }
}

export async function down(db: Db) {
    const collection = db.collection("images");

    await collection.updateMany(
        { claimRevisionId: { $exists: true } },
        { $unset: { claimRevisionId: "" } }
    );
}
