import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    await db
        .collection("claimreviewtasks")
        .updateMany({}, { $set: { reportModel: "Fact-checking" } });
}

export async function down(db: Db) {
    await db
        .collection("claimreviewtasks")
        .updateMany({}, { $unset: { reportModel: "" } });
}
