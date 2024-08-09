import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const reviewTasksCursor = await db.collection("reviewtasks").find();

    while (await reviewTasksCursor.hasNext()) {
        const reviewTask = await reviewTasksCursor.next();
        if (reviewTask.machine.context.claimReview.claim) {
            await db.collection("reviewtasks").updateOne(
                { _id: reviewTask._id },
                {
                    $set: {
                        target: reviewTask.machine.context.claimReview.claim,
                    },
                    $unset: {
                        "machine.context.claimReview.claim": undefined,
                    },
                }
            );
        }

        if (reviewTask.machine.context.claimReview.source) {
            await db.collection("reviewtasks").updateOne(
                { _id: reviewTask._id },
                {
                    $set: {
                        target: reviewTask.machine.context.claimReview.source,
                    },
                    $unset: {
                        "machine.context.claimReview.source": undefined,
                    },
                }
            );
        }
    }
}
