import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    await db.collection("users").updateMany({}, { $set: { state: "active" } });
}
export async function down(db: Db, client) {}
