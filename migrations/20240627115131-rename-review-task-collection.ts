import { Db } from "mongodb";

export async function up(db: Db) {
    const collection = db.collection("claimreviewtasks");

    await collection.rename("reviewtasks");
}

export async function down(db: Db) {
    const collection = db.collection("reviewtasks");

    await collection.rename("claimreviewtasks");
}
