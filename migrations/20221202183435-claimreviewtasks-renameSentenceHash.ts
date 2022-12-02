import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("claimreviewtasks")
        .updateMany({}, { $rename: { sentence_hash: "data_hash" } });
}
export async function down(db: Db) {
    await db
        .collection("claimreviewtasks")
        .updateMany(
            { data_hash: { $exists: true } },
            { $rename: { data_hash: "sentence_hash" } }
        );
}
