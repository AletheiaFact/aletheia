import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    /*  if there was no personality field, create an empty array
     if there was a personality field, but it was not an array, make it an array
     if there was a personality field, and it was an array, rename it to personalities */
    const claimRevisionsCursor = await db.collection("claimrevisions").find();
    while (await claimRevisionsCursor.hasNext()) {
        const doc = await claimRevisionsCursor.next();
        if (doc.personality === null) {
            await db
                .collection("claimrevisions")
                .updateOne(
                    { _id: doc._id },
                    { $set: { personalities: [] }, $unset: { personality: 1 } }
                );
        } else if (!Array.isArray(doc.personality)) {
            await db.collection("claimrevisions").updateOne(
                { _id: doc._id },
                {
                    $set: { personalities: [doc.personality] },
                    $unset: { personality: 1 },
                }
            );
        } else {
            await db
                .collection("claimrevisions")
                .updateOne(
                    { _id: doc._id },
                    { $rename: { personality: "personalities" } }
                );
        }
    }
}

export async function down(db: Db) {
    /*  if it was an empty array, remove it
        if it was an array with one element, remove the array and rename the field to personality
        if it was an array with more than one element, rename the field to personality
    */
    const claimRevisionsCursor = await db.collection("claimrevisions").find();
    while (await claimRevisionsCursor.hasNext()) {
        const doc = await claimRevisionsCursor.next();
        if (doc.personalities.length === 0) {
            await db.collection("claimrevisions").updateOne(
                { _id: doc },
                {
                    $unset: { personalities: 1 },
                    $set: { personality: null },
                }
            );
        } else if (doc.personalities.length === 1) {
            await db.collection("claimrevisions").updateOne(
                { _id: doc._id },
                {
                    $set: { personality: doc.personalities[0] },
                    $unset: { personalities: 1 },
                }
            );
        } else {
            await db.collection("claimrevisions").updateOne(
                { _id: doc._id },
                {
                    $rename: { personalities: "personality" },
                }
            );
        }
    }
}
