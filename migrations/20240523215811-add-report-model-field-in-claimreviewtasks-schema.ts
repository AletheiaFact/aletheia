import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("claimreviewtasks")
        .updateMany({}, { $set: { reportModel: "Fact-checking" } });
}
