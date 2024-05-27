import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("reports")
        .updateMany({}, { $set: { reportModel: "Fact-checking" } });
}

export async function down(db: Db) {
    await db
        .collection("reports")
        .updateMany({}, { $unset: { reportModel: "" } });
}
