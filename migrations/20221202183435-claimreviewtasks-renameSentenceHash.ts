import { Db } from "mongodb";

export async function up(db: Db) {
    const indexPresent = await db
        .collection("claimreviewtasks")
        .indexExists("sentence_hash_1");
    if (indexPresent) {
        await db.collection("claimreviewtasks").dropIndex("sentence_hash_1");
    }
    await db
        .collection("claimreviewtasks")
        .updateMany({}, { $rename: { sentence_hash: "data_hash" } });
    await db.collection("claimreviewtasks").createIndex({ data_hash: 1 });
}
export async function down(db: Db) {
    const indexPresent = await db
        .collection("claimreviewtasks")
        .indexExists("data_hash_1");
    if (indexPresent) {
        await db.collection("claimreviewtasks").dropIndex("data_hash_1");
    }
    await db
        .collection("claimreviewtasks")
        .updateMany(
            { data_hash: { $exists: true } },
            { $rename: { data_hash: "sentence_hash" } }
        );
    await db.collection("claimreviewtasks").createIndex({ sentence_hash: 1 });
}
