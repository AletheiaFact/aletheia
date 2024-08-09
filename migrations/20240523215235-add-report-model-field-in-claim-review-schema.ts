import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    await db
        .collection("claimreviews")
        .updateMany({}, { $set: { reportModel: "Fact-checking" } });
}

export async function down(db: Db) {
    await db
        .collection("claimreviews")
        .updateMany({}, { $unset: { reportModel: "" } });
}
