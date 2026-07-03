import { Db } from "mongodb";

/**
 * The review-task listing aggregation (ReviewTaskService.listAll) starts with:
 *
 *   { $match: { "machine.value": <value>, reviewTaskType: <type>, nameSpace: <ns> } }
 *   ... $lookup x4 ...
 *   { $sort: { _id: -1 } }, { $skip }, { $limit }
 *
 * With no supporting index this runs a COLLSCAN over the whole `reviewtasks`
 * collection (~494k docs examined to return 10) plus a blocking in-memory sort.
 *
 * This compound index follows the ESR rule (Equality → Sort → Range):
 *  - reviewTaskType / nameSpace: always equality across every listing shape.
 *  - machine.value: equality for plain states (e.g. "published"), $in for
 *    "cross-checking"; placed right before the sort key.
 *  - _id: the sort key (descending), so the index also satisfies the $sort and
 *    eliminates the blocking sort. Reverse traversal covers the "asc" case too.
 *
 * Result: bounded index scan + index-provided sort instead of COLLSCAN + sort.
 */
const INDEX_KEY = {
    reviewTaskType: 1,
    nameSpace: 1,
    "machine.value": 1,
    _id: -1,
} as const;

const INDEX_NAME = "reviewTaskType_1_nameSpace_1_machine.value_1__id_-1";

export async function up(db: Db) {
    const collection = db.collection("reviewtasks");
    await collection.createIndex(INDEX_KEY, { name: INDEX_NAME });
    console.log(`  - reviewtasks: created index ${INDEX_NAME}`);
}

export async function down(db: Db) {
    const collection = db.collection("reviewtasks");
    try {
        await collection.dropIndex(INDEX_NAME);
        console.log(`  - reviewtasks: dropped index ${INDEX_NAME}`);
    } catch (error) {
        console.log(`  - reviewtasks: index ${INDEX_NAME} not found, skipping`);
    }
}
