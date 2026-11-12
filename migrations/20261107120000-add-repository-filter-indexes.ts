import { Db } from "mongodb";

/**
 * The repository page filters (`GET api/claim` and `GET api/review` with
 * q / topic / reviewStatus) join on fields that have no index, so each
 * `$lookup` scans the whole foreign collection once per row:
 *
 * - claims → claimrevisions on `claimId` (every revision of the claim)
 * - claimrevisions → sentences / images on `claimRevisionId` (text search
 *   and topic filter), matching `topics.id` inside the join
 * - claims → claimreviews on `target` (the "with / without reviews" filter;
 *   also ClaimReviewService.getReviewStatsByClaimId and the classification
 *   counts every claim card loads)
 * - claimreviews → sentences on `data_hash` (fact-check text search; also
 *   SentenceService.getByDataHash, called for every listed review)
 *
 * Plain, non-unique indexes: none of these fields is unique.
 */
const INDEXES: { collection: string; key: Record<string, 1>; name: string }[] =
    [
        {
            collection: "claimrevisions",
            key: { claimId: 1 },
            name: "claimId_1",
        },
        {
            collection: "sentences",
            key: { claimRevisionId: 1 },
            name: "claimRevisionId_1",
        },
        {
            collection: "sentences",
            key: { data_hash: 1 },
            name: "data_hash_1",
        },
        {
            collection: "sentences",
            key: { "topics.id": 1 },
            name: "topics.id_1",
        },
        {
            collection: "images",
            key: { claimRevisionId: 1 },
            name: "claimRevisionId_1",
        },
        {
            collection: "images",
            key: { "topics.id": 1 },
            name: "topics.id_1",
        },
        {
            collection: "claimreviews",
            key: { target: 1 },
            name: "target_1",
        },
    ];

// An index on the same key under another name (e.g. one created by hand)
const INDEX_OPTIONS_CONFLICT = 85;

export async function up(db: Db) {
    for (const { collection, key, name } of INDEXES) {
        try {
            // A no-op when this exact index already exists
            await db.collection(collection).createIndex(key, { name });
            console.log(`  - ${collection}: created index ${name}`);
        } catch (error) {
            if (error?.code !== INDEX_OPTIONS_CONFLICT) {
                throw error;
            }
            console.log(
                `  - ${collection}: ${JSON.stringify(key)} already indexed under another name, skipping`
            );
        }
    }
}

export async function down(db: Db) {
    for (const { collection, name } of INDEXES) {
        try {
            await db.collection(collection).dropIndex(name);
            console.log(`  - ${collection}: dropped index ${name}`);
        } catch (error) {
            console.log(`  - ${collection}: index ${name} not found, skipping`);
        }
    }
}
