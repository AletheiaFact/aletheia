import { Db } from "mongodb";

export async function up(db: Db) {
    const claimReviewCursor = await db.collection("claimreviews").find();

    while (await claimReviewCursor.hasNext()) {
        const claimReview = await claimReviewCursor.next();
        if (claimReview.claim) {
            await db.collection("claimreviews").updateOne(
                { _id: claimReview._id },
                {
                    $set: {
                        target: claimReview.claim,
                        targetModel: "Claim",
                    },
                    $unset: {
                        claim: undefined,
                    },
                }
            );
        }

        if (claimReview.source) {
            await db.collection("claimreviews").updateOne(
                { _id: claimReview._id },
                {
                    $set: {
                        target: claimReview.source,
                        targetModel: "Source",
                    },
                    $unset: {
                        source: undefined,
                    },
                }
            );
        }
    }
}
