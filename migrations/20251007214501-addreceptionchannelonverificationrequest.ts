import { Db } from "mongodb";

export async function up(db: Db) {

  await db
    .collection("verificationrequests")
    .updateMany(
      {},
      { $set: { sourceChannel: "instagram" } },
    );
}
