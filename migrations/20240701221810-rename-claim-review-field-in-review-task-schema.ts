import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const reviewTasksCursor = await db.collection("reviewtasks").find();

    while (await reviewTasksCursor.hasNext()) {
        const reviewTask = await reviewTasksCursor.next();

        await db.collection("reviewtasks").updateOne(
            { _id: reviewTask._id },
            {
                $rename: {
                    "machine.context.claimReview": "machine.context.review",
                },
            }
        );
    }
}

export async function down(db: Db) {
    const reviewTasksCursor = await db.collection("reviewtasks").find();

    while (await reviewTasksCursor.hasNext()) {
        const reviewTask = await reviewTasksCursor.next();

        await db.collection("reviewtasks").updateOne(
            { _id: reviewTask._id },
            {
                $rename: {
                    "machine.context.review": "machine.context.claimReview",
                },
            }
        );
    }
}
