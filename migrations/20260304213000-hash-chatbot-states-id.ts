import { Db } from "mongodb";
import * as crypto from "crypto";

export async function up(db: Db) {
    const collection = db.collection("chatbotstates");
    const cursor = collection.find({});

    let migratedCount = 0;

    console.log("🚀 Starting Privacy Migration: Converting IDs to ObjectId and creating data_hash...");

    while (await cursor.hasNext()) {
        const doc = await cursor.next();

        if (doc && doc._id && typeof doc._id === 'string') {
            const hash = crypto
                .createHash("sha256")
                .update(doc._id)
                .digest("hex");

            const { _id, ...rest } = doc;

            try {
                await collection.insertOne({
                    data_hash: hash,
                    ...rest,
                    migratedAt: new Date()
                });

                await collection.deleteOne({ _id: doc._id });

                migratedCount++;
            } catch (err: any) {
                console.error(`❌ Erro ao migrar ${doc._id}:`, err.message);
            }
        }
    }
    console.log(`✅ Success! ${migratedCount} sessions were anonymized and migrated to ObjectIds.`);
}

export async function down(db: Db) {
    /**
     * NO-OP: This migration is irreversible via simple script.
     * To reverse this, you would need to restore the 'data_hash' back into
     * the '_id' field and delete the ObjectId records, which is risky.
     */
    console.warn('⚠️ Down migration: Data structural change is irreversible.');
}
