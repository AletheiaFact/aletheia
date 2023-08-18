import { Db } from "mongodb";
import { Types } from "mongoose";

export async function up(db: Db) {
    await db.collection("claimrevisions").deleteMany({
        claimId: {
            $nin: [
                Types.ObjectId("64df8a969cafe05a88b5ad5d"),
                Types.ObjectId("63012da693f87f0026b5707e"),
            ],
        },
    });
}
