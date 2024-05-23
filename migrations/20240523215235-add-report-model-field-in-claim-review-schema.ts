import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("claimreviews")
        .updateMany({}, { $set: { reportModel: "Fact-checking" } });
}
