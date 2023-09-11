import { Db } from "mongodb";

export async function up(db: Db) {
    await db.collection("claims").updateMany({}, { $set: { isHidden: false } });
}
