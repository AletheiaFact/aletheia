import { stateName } from "../review-workflow/machine";
import { stripSourceMarkup } from "../review-workflow/review-log";
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
        summary: reviewData.summary
            ? stripSourceMarkup(reviewData.summary)
            : null,
        // Why a task came back to its writers, if it did.
        crossCheck: reviewData.crossCheckingClassification
            ? {
                  classification: reviewData.crossCheckingClassification,
                  comment: reviewData.crossCheckingComment || null,
              }
            : null,
        rejectionComment: reviewData.rejectionComment || null,
        createdAt: doc.createdAt,
    };
}

/** A user as tool responses show it: never email, Ory id or roles. */
export function describeUser(user: any) {
    if (!user || typeof user !== "object" || !("_id" in user)) {
        return user ? String(user) : null;
    }
    return { _id: String(user._id), name: user.name ?? null };
}

/** A review comment without the author's private fields. */
export function describeComment(comment: any) {
    if (!comment) return null;
    const doc =
        typeof comment.toObject === "function" ? comment.toObject() : comment;
    return {
        _id: String(doc._id),
        type: doc.type,
        text: doc.text,
        comment: doc.comment,
        user: describeUser(doc.user),
        resolved: !!doc.resolved,
        createdAt: doc.createdAt,
    };
}

/**
 * The task view a cross-checker gets when taking the task: without the
 * writer's label and summary, so the cross-check reaches its own conclusion
 * first (manual: an independent re-check). get_review_log shows them after.
 */
export async function describeTaskBlind(deps: McpToolDeps, task: any) {
    const view = await describeTask(deps, task);
    if (!view) return null;
    const { classification: _label, summary: _summary, ...blind } = view;
    return blind;
}
