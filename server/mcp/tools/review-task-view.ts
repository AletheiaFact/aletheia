import { collectSentences, stateName } from "../review-workflow/machine";
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

// Sentences shown on each side of the task's own sentence: enough context
// to understand it without dumping a whole debate transcript.
const CONTEXT_SENTENCES = 5;

/**
 * The claim around a task's sentence, as the queue tools hand it out so the
 * agent does not need a separate get_claim: who said it, when, the claim's
 * own sources and the neighbouring sentences. Null when the claim cannot be
 * read (the task view is still returned).
 */
export async function describeClaimContext(deps: McpToolDeps, task: any) {
    if (!task) return null;
    const doc = typeof task.toObject === "function" ? task.toObject() : task;
    try {
        const claim: any = await deps.claimService.getById(
            String(doc.target),
            doc.nameSpace
        );
        if (!claim) return null;
        const sentences = collectSentences(claim.content ?? claim);
        const at = sentences.findIndex(
            (sentence) => sentence.dataHash === doc.data_hash
        );
        const from = Math.max(0, at - CONTEXT_SENTENCES);
        return {
            claimId: String(claim._id ?? doc.target),
            title: claim.title ?? null,
            date: claim.date ?? null,
            contentModel: claim.contentModel ?? null,
            slug: claim.slug ?? null,
            personalities: (claim.personalities ?? [])
                .filter((p: unknown) => p && typeof p === "object")
                .map((p: any) => ({
                    _id: String(p._id),
                    name: p.name ?? null,
                    description: p.description ?? null,
                })),
            sources: (claim.sources ?? [])
                .map((source: any) => source?.href)
                .filter(Boolean),
            sentenceCount: sentences.length,
            sentences: (at < 0
                ? sentences.slice(0, CONTEXT_SENTENCES * 2 + 1)
                : sentences.slice(from, at + CONTEXT_SENTENCES + 1)
            ).map((sentence) => ({
                ...sentence,
                isTask: sentence.dataHash === doc.data_hash,
            })),
        };
    } catch {
        return null;
    }
}

/**
 * The fact-check publish_review_task created, compact: the stored HTML of
 * each field and the sources with their footnote numbers, so the reviewer
 * can inspect the result without a get_claim_review call.
 */
export async function describePublishedReview(deps: McpToolDeps, task: any) {
    if (!task) return null;
    try {
        const review: any = await deps.claimReviewService.getReviewByDataHash(
            task.data_hash
        );
        if (!review) return null;
        const report = review.report ?? {};
        return {
            claimReviewId: String(review._id),
            isPublished: !!review.isPublished,
            classification: report.classification ?? null,
            summary: report.summary ?? null,
            report: report.report ?? null,
            verification: report.verification ?? null,
            questions: report.questions ?? [],
            sources: (report.sources ?? []).map((source: any) => ({
                href: source?.href ?? null,
                field: source?.props?.field ?? null,
                targetText: source?.props?.targetText ?? null,
                sup: source?.props?.sup ?? null,
            })),
        };
    } catch {
        return null;
    }
}
