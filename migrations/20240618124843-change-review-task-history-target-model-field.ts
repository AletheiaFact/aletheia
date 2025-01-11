import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    const collection = db.collection("histories");

    await collection.updateMany(
        { targetModel: "ClaimReviewTask" },
        { $set: { targetModel: "ReviewTask" } }
    );
}

export async function down(db: Db) {
    const collection = db.collection("histories");

    await collection.updateMany(
        { targetModel: "ReviewTask" },
        { $set: { targetModel: "ClaimReviewTask" } }
    );
}
