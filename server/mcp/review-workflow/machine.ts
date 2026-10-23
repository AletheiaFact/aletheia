import { toObjectId } from "./access";

/**
 * Shapes of the persisted review-task `machine` document. The XState machine
 * lives in the frontend (src/machines/reviewTask); the server writes the same
 * shapes the web app does so both stay interchangeable.
 */

// The web app persists XState's state.value, so the compound `assigned`
// state (draft sub-states) is stored as an object. The Kanban queries
// `machine.value.assigned`, so a plain "assigned" string would be invisible.
export const ASSIGNED_VALUE = { assigned: "undraft" };

export const CROSS_CHECKING_VALUES = [
    "cross-checking",
    "addCommentCrossChecking",
];

/** Human-readable workflow state, flattening compound values like `{assigned: "draft"}`. */
export function stateName(value: unknown): string {
    if (value && typeof value === "object") {
        return Object.keys(value)[0];
    }
    return String(value);
}

// Sentences are the leaves of a claim's content tree: paragraphs also carry
// a data_hash, but their `content` is an array rather than a string.
export function collectSentenceHashes(
    node: any,
    found: string[] = []
): string[] {
    if (Array.isArray(node)) {
        node.forEach((child) => collectSentenceHashes(child, found));
    } else if (node && typeof node === "object") {
        if (node.data_hash && typeof node.content === "string") {
            found.push(node.data_hash);
        }
        Object.values(node).forEach((child) =>
            collectSentenceHashes(child, found)
        );
    }
    return found;
}

/** Id of the claim's first personality, as the web form sends it; "" when none. */
export function claimPersonalityId(claim: any): string {
    const personality = claim?.personalities?.[0];
    const id = personality?._id ?? personality;
    return id ? id.toString() : "";
}

// Mirrors getInitialContext(ReviewTaskTypeEnum.Claim, { usersId }) from
// src/machines/reviewTask/context.ts, which the frontend uses to hydrate its
// XState machine. A parity spec keeps the two in sync. The web form also sets
// `review.personality`; the ClaimReview created on publish copies it.
export function buildClaimContext(
    usersId: unknown[],
    claimId: string,
    personality = ""
) {
    return {
        reviewData: {
            usersId,
            summary: "",
            classification: "",
            reviewerId: null,
            crossCheckerId: null,
            crossCheckingComments: [],
            crossCheckingComment: "",
            crossCheckingClassification: "",
            questions: [],
            report: "",
            verification: "",
            sources: [],
        },
        review: {
            personality,
            usersId: "",
            targetId: claimId,
            target: claimId,
            isPartialReview: false,
        },
    };
}

/** Update that moves a task to `assigned` with the user as its only assignee. */
export function assignTo(userId: string) {
    return {
        $set: {
            "machine.value": ASSIGNED_VALUE,
            "machine.context.reviewData.usersId": [toObjectId(userId)],
        },
    };
}
