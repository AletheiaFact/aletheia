import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("topics")
        .updateMany({ aliases: { $exists: false } }, { $set: { aliases: [] } });
}

export async function down(db: Db) {
    await db
        .collection("topics")
        .updateMany(
            { aliases: { $exists: true } },
            { $unset: { aliases: "" } }
        );
}
