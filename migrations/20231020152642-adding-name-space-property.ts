import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    await db
        .collection("claims")
        .updateMany({}, { $set: { nameSpace: "main" } });
}
