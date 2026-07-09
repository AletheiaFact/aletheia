import { Db } from "mongodb";

/**
 * The review-task "published" listing aggregation (ReviewTaskService.listAll,
 * via _verifyMachineValueAndAddMatchPipeline) joins each matched review task to
 * its claim review:
 *
 *   { $lookup: {
 *       from: "claimreviews",
 *       localField: "data_hash",
 *       foreignField: "data_hash",
 *       as: "machine.context.claimReview.claimReview",
 *   } }
 *
 * `claimreviews.data_hash` has no index, so this equality join runs a COLLSCAN
 * of the whole `claimreviews` collection for every review task in the stream.
 * With ~396 published tasks matched and ~1.2k claim reviews, that is ~494k docs
 * examined to return 10 rows (the dominant cost of the ~718ms query), even
 * though the reviewtasks $match itself is already a bounded index scan.
 *
 * A plain (non-unique) index on data_hash turns the per-row COLLSCAN into an
 * indexed nested-loop join. The field is intentionally non-unique: multiple
 * claim reviews can share the same data_hash (see ClaimReviewService grouping
 * by data_hash + classification and getReviewByDataHash lookups).
 */
const INDEX_KEY = { data_hash: 1 } as const;

const INDEX_NAME = "data_hash_1";

export async function up(db: Db) {
    const collection = db.collection("claimreviews");
    await collection.createIndex(INDEX_KEY, { name: INDEX_NAME });
    console.log(`  - claimreviews: created index ${INDEX_NAME}`);
}

export async function down(db: Db) {
    const collection = db.collection("claimreviews");
    try {
        await collection.dropIndex(INDEX_NAME);
        console.log(`  - claimreviews: dropped index ${INDEX_NAME}`);
    } catch (error) {
        console.log(
            `  - claimreviews: index ${INDEX_NAME} not found, skipping`
        );
    }
}
