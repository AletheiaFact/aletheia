import { Db } from "mongodb";
import { Types } from "mongoose";

export async function up(db: Db) {
    return;
}

export async function down(db: Db) {
    await db
        .collection("claimreviews")
        .updateMany(
            { claim: new Types.ObjectId("64df8a969cafe05a88b5ad5d") },
            { $set: { isDeleted: true } }
        );
}
