import { Db } from "mongodb";
const ObjectId = require("mongodb").ObjectID;

export async function up(db: Db) {
    const reviewTasksCursor = await db.collection("reviewtasks").find();

    while (await reviewTasksCursor.hasNext()) {
        const reviewTask = await reviewTasksCursor.next();
        if (reviewTask.machine.context.claimReview.claim) {
            const claim = await db
                .collection("claims")
                .findOne({
                    _id: ObjectId(reviewTask.machine.context.claimReview.claim),
                });

            await db
                .collection("reviewtasks")
                .updateOne(
                    { _id: reviewTask._id },
                    { $set: { nameSpace: claim?.nameSpace } }
                );
        }

        if (reviewTask.machine.context.claimReview.source) {
            const source = await db
                .collection("sources")
                .findOne({
                    _id: ObjectId(
                        reviewTask.machine.context.claimReview.source
                    ),
                });

            await db
                .collection("reviewtasks")
                .updateOne(
                    { _id: reviewTask._id },
                    { $set: { nameSpace: source?.nameSpace } }
                );
        }
    }
}

export async function down(db: Db) {
    await db
        .collection("reviewtasks")
        .updateMany({}, { $unset: { nameSpace: "" } });
}
