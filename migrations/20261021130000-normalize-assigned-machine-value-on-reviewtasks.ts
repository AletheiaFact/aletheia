import { Db } from "mongodb";

/**
 * The web app persists XState's `state.value`, and `assigned` is a compound
 * state (draft sub-states), so it is stored as `{ assigned: "undraft" }` or
 * `{ assigned: "draft" }`. The Kanban and listing queries match it with
 * `machine.value.assigned: { $exists: true }`
 * (server/review-task/mongo-utils.ts).
 *
 * Two server paths stored the plain string `"assigned"` instead: the MCP
 * `start_review_task` tool and `ReviewTaskService.saveDraft`'s auto-create.
 * Those tasks were invisible in the Kanban "assigned" column. Both paths now
 * write the object shape; this migration rewrites the existing ones.
 *
 * A task with any report content is marked `draft`, otherwise `undraft`.
 */
const HAS_CONTENT = {
    $or: [
        { "machine.context.reviewData.summary": { $nin: [null, ""] } },
        { "machine.context.reviewData.report": { $nin: [null, ""] } },
        { "machine.context.reviewData.visualEditor": { $exists: true } },
    ],
};

export async function up(db: Db) {
    const collection = db.collection("reviewtasks");
    const draft = await collection.updateMany(
        { "machine.value": "assigned", ...HAS_CONTENT },
        { $set: { "machine.value": { assigned: "draft" } } }
    );
    const undraft = await collection.updateMany(
        { "machine.value": "assigned" },
        { $set: { "machine.value": { assigned: "undraft" } } }
    );
    console.log(
        `  - reviewtasks: normalized plain "assigned" values ` +
            `(${draft.modifiedCount} draft, ${undraft.modifiedCount} undraft)`
    );
}

export async function down() {
    // Normalized documents can't be told apart from ones the web app wrote,
    // and the object shape is the valid one for both; nothing to undo.
    console.log("  - reviewtasks: assigned value normalization is kept");
}
