import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("reports")
        .updateMany({}, { $set: { reportModel: "Fact-checking" } });
}
