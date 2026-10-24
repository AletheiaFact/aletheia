import { Db } from "mongodb";

/**
 * The MCP task queue relies on `reviewtasks.data_hash` being unique: the
 * queue feed (ReviewTaskService.enqueueUnassigned) upserts one `unassigned`
 * task per sentence and treats a duplicate-key error as "already queued".
 *
 * The schema declares `data_hash` as `unique: true`, so Mongoose's autoIndex
 * normally builds `data_hash_1`. Environments that run with autoIndex off, or
 * whose collection predates the declaration, may lack it. This migration
 * creates it when missing.
 *
 * If duplicate data_hash values already exist, or a non-unique data_hash
 * index is in the way, the migration fails: migrate-mongo would otherwise
 * record it as applied and never run it again, leaving the queue without the
 * index it relies on. Resolve the duplicates (or drop the non-unique index)
 * and run `yarn migrate` again.
 */
const INDEX_KEY = { data_hash: 1 } as const;

const INDEX_NAME = "data_hash_1";

export async function up(db: Db) {
    const collection = db.collection("reviewtasks");
    const existing = (await collection.indexes()).find(
        (index) =>
            Object.keys(index.key).length === 1 && index.key.data_hash === 1
    );
    if (existing?.unique) {
        console.log(`  - reviewtasks: unique ${existing.name} already present`);
        return;
    }
    if (existing) {
        throw new Error(
            `reviewtasks: ${existing.name} exists but is NOT unique; ` +
                `drop it and run the migration again to enforce uniqueness`
        );
    }

    const duplicates = await collection
        .aggregate([
            { $group: { _id: "$data_hash", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $limit: 20 },
        ])
        .toArray();
    if (duplicates.length) {
        throw new Error(
            `reviewtasks: cannot create unique ${INDEX_NAME}, ` +
                `duplicate data_hash values (first ${duplicates.length}): ` +
                duplicates.map((d) => `${d._id} x${d.count}`).join(", ")
        );
    }

    await collection.createIndex(INDEX_KEY, {
        name: INDEX_NAME,
        unique: true,
    });
    console.log(`  - reviewtasks: created unique index ${INDEX_NAME}`);
}

export async function down() {
    // The schema declares this index; dropping it would only let Mongoose
    // rebuild it on the next boot with autoIndex on.
    console.log("  - reviewtasks: unique data_hash index left in place");
}
