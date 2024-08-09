import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const claimReviewsCursor = await db.collection("claimreviews").find();

    while (await claimReviewsCursor.hasNext()) {
        const claimReview = await claimReviewsCursor.next();
        const claim = await db
            .collection("claims")
            .findOne({ _id: claimReview.claim });

        await db
            .collection("claimreviews")
            .updateOne(
                { _id: claimReview._id },
                { $set: { nameSpace: claim.nameSpace } }
            );
    }
}

export async function down(db: Db) {
    await db
        .collection("claimreviews")
        .updateMany({}, { $unset: { nameSpace: "" } });
}
