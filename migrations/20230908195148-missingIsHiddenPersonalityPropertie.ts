import { Db } from "mongodb";

export async function up(db: Db) {
    await db
        .collection("personalities")
        .updateMany({}, { $set: { isHidden: false } });
}
