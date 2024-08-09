import { Db } from "mongodb";
export async function up(db: Db, client) {
    return;
    // migrations not needed
    const claimreviewsCursor = await db.collection("claimreviews").find();
    while (await claimreviewsCursor.hasNext()) {
        const doc = await claimreviewsCursor.next();
        if (doc.isHidden === undefined) {
            await db
                .collection("claimreviews")
                .updateOne({ _id: doc._id }, { $set: { isHidden: false } });
        }
    }
}
export async function down(db: Db, client) {}
