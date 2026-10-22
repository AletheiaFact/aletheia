import { stateName } from "../review-workflow.service";
import type { McpToolDeps } from "../mcp.service";

/**
 * Compact, model-friendly view of a review task: the stored document carries
 * the whole editor state (visualEditor, HTML), which is noise for an agent
 * deciding what to work on next.
 */
export async function describeTask(deps: McpToolDeps, task: any) {
    if (!task) return null;
    const doc = typeof task.toObject === "function" ? task.toObject() : task;
    const reviewData = doc.machine?.context?.reviewData ?? {};
    let sentence: string | null = null;
    try {
        const found = await deps.sentenceService.getByDataHash(doc.data_hash);
        sentence = typeof found?.content === "string" ? found.content : null;
    } catch {
        // Non-sentence targets (images, sources) have no sentence text.
    }
    return {
        reviewTaskId: doc._id?.toString(),
        dataHash: doc.data_hash,
        nameSpace: doc.nameSpace,
        claimId: doc.target?.toString(),
        state: stateName(doc.machine?.value),
        sentence,
        assignees: (reviewData.usersId ?? []).map((id: unknown) => String(id)),
        reviewerId: reviewData.reviewerId
            ? String(reviewData.reviewerId)
            : null,
        crossCheckerId: reviewData.crossCheckerId
            ? String(reviewData.crossCheckerId)
            : null,
        classification: reviewData.classification || null,
        summary: reviewData.summary || null,
        createdAt: doc.createdAt,
    };
}
