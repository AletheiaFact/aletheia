import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    await db
        .collection("claimreviews")
        .updateMany({}, { $rename: { sentence_hash: "data_hash" } });
}
export async function down(db: Db) {
    await db
        .collection("claimreviews")
        .updateMany({}, { $rename: { data_hash: "sentence_hash" } });
}
