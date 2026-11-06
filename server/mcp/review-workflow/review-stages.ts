import { ConflictException, ForbiddenException } from "@nestjs/common";
import { ReviewTaskQueueService } from "../../review-task/review-task-queue.service";
import { ReviewTaskService } from "../../review-task/review-task.service";
import {
    idsEqual,
    isAdmin,
    toObjectId,
    WorkflowUser,
} from "./access";
import { CROSS_CHECKING_VALUES, stateName } from "./machine";
import { missingReportFields } from "./publish-rules";
import { ReviewNotifierService } from "./review-notifier.service";
import { assertAllowedClassification } from "../../review-task/classification-methodology.rules";
import { assertWriter, REVIEW_DATA, WorkflowConfig } from "./workflow-guards";

const MOVED_BY_SOMEONE_ELSE =
    "The task was moved by someone else meanwhile; read it again with get_review_task";

/** The field naming who took the task out of each backlog. */
const BACKLOG_TAKER = {
    selectCrossChecker: "crossCheckerId",
    selectReviewer: "reviewerId",
} as const;
type Backlog = keyof typeof BACKLOG_TAKER;

/** The task waits in `backlog` and nobody has taken it yet. */
function inBacklog(task: any, backlog: Backlog): boolean {
    return (
        stateName(task.machine?.value) === backlog &&
        !task.machine?.context?.reviewData?.[BACKLOG_TAKER[backlog]]
    );
}

/** Atomic-write filter for {@link inBacklog} (`null` also matches a missing field). */
function backlogFilter(backlog: Backlog) {
    return {
        "machine.value": backlog,
        [`${REVIEW_DATA}.${BACKLOG_TAKER[backlog]}`]: null,
    };
}

/**
 * The refusal when a send found the task in none of the states it moves
 * from: where the task is and what to do instead, or a race message when
 * the stored copy was sendable and someone moved the task meanwhile.
 */
function notSent(
    task: any,
    target: "cross-checking" | "review",
    fromBacklogs: Backlog[]
): ConflictException {
    const state = stateName(task.machine?.value);
    const sendable =
        state === "reported" || fromBacklogs.some((b) => inBacklog(task, b));
    if (sendable) {
        return new ConflictException(MOVED_BY_SOMEONE_ELSE);
    }
    const skipHint =
        target === "review" && inBacklog(task, "selectCrossChecker")
            ? " To send it to review without the cross-check, use submit_report_to_review."
            : "";
    return new ConflictException(
        `Only reported tasks can be sent to ${target} (task is "${state}"). ${afterReportHint(
            state
        )}${skipHint}`.trim()
    );
}

/**
 * A review send already made: the task is in the picked reviewer's review,
 * or (without a pick) waits in the review backlog.
 */
function alreadySentToReview(task: any, reviewerId?: string): boolean {
    if (!reviewerId) {
        return inBacklog(task, "selectReviewer");
    }
    return (
        stateName(task.machine?.value) === "submitted" &&
        idsEqual(task.machine?.context?.reviewData?.reviewerId, reviewerId)
    );
}

/** The report has a cross-check that agrees with its label. */
function crossCheckAgreed(task: any): boolean {
    const reviewData = task.machine?.context?.reviewData ?? {};
    return (
        !!reviewData.crossCheckingClassification &&
        reviewData.crossCheckingClassification === reviewData.classification
    );
}

/**
 * The refusal when review requires an agreeing cross-check the report does
 * not have; a task elsewhere in the flow is told where it is instead.
 */
function missingCrossCheck(task: any): ConflictException {
    return stateName(task.machine?.value) === "reported"
        ? new ConflictException(
              "The report has no cross-check that agrees with its label yet, which review requires. To ask for one, use send_to_cross_check; to send it to review without a cross-check, use submit_report_to_review"
          )
        : notSent(task, "review", []);
}

/** The task's writers other than `user`, who are told it moved on. */
function otherAssignees(task: any, user: WorkflowUser): unknown[] {
    return (task.machine.context.reviewData.usersId ?? []).filter(
        (id: unknown) => !idsEqual(id, user._id)
    );
}

/**
 * What a writer can do with a task in `state` when it cannot be sent on,
 * so an agent is told the way forward instead of guessing (issue #2708).
 */
export function afterReportHint(state: string): string {
    switch (state) {
        case "assigned":
            return "Finish the report with submit_report first (with sendToCrossCheck: true it also asks for the cross-check), or use submit_report_to_review to skip the cross-check.";
        case "unassigned":
            return "Nobody is writing it yet.";
        case "selectCrossChecker":
            return "It is waiting for a cross-checker; an agreeing cross-check sends it to review by itself.";
        case "cross-checking":
        case "addCommentCrossChecking":
            return "A cross-checker is on it; an agreeing cross-check sends it to review by itself.";
        case "selectReviewer":
            return "It is waiting for a reviewer already.";
        case "submitted":
            return "A reviewer is on it already.";
        case "published":
            return "It is already published.";
        default:
            return "";
    }
}

/**
 * The stages after writing: cross-check, review, rejection and publishing.
 * Each method validates the caller and the current state, then moves the
 * task with a guarded atomic write.
 */
export class ReviewStages {
    constructor(
        private readonly reviewTaskService: ReviewTaskService,
        private readonly reviewTaskQueue: ReviewTaskQueueService,
        private readonly config: WorkflowConfig,
        private readonly notifier?: ReviewNotifierService
    ) {}

    /**
     * Moves a `reported` task to the cross-check backlog
     * (`selectCrossChecker` with no cross-checker), where another checker
     * can claim it. A task waiting for a reviewer that nobody took yet can
     * be moved too, as the web's "back" from the reviewer selection does.
     * Already in the cross-check backlog: returned as is. Assignees or
     * admins only. With `crossCheckerId` (checked by the caller with
     * assertAssignable) the task goes straight to that user's
     * cross-checking, as picking one on the web does.
     */
    async sendToCrossCheck(
        user: WorkflowUser,
        task: any,
        crossCheckerId?: string
    ) {
        assertWriter(user, task, "send it to cross-checking");
        if (crossCheckerId) {
            return this.assignCrossChecker(user, task, crossCheckerId);
        }
        if (inBacklog(task, "selectCrossChecker")) {
            return task;
        }
        const sent = await this.reviewTaskQueue.transitionAtomically(
            {
                _id: task._id,
                $or: [
                    { "machine.value": "reported" },
                    backlogFilter("selectReviewer"),
                ],
            },
            {
                $set: {
                    "machine.value": "selectCrossChecker",
                    [`${REVIEW_DATA}.crossCheckerId`]: null,
                    [`${REVIEW_DATA}.crossCheckingClassification`]: "",
                    [`${REVIEW_DATA}.crossCheckingComment`]: "",
                },
            }
        );
        if (!sent) {
            throw notSent(task, "cross-checking", ["selectReviewer"]);
        }
        return sent;
    }

    /**
     * Makes `crossCheckerId` the task's cross-checker (`cross-checking`)
     * from `reported` or either backlog nobody took. Picking the same
     * cross-checker again is a no-op.
     */
    private async assignCrossChecker(
        user: WorkflowUser,
        task: any,
        crossCheckerId: string
    ) {
        const reviewData = task.machine?.context?.reviewData ?? {};
        if (
            CROSS_CHECKING_VALUES.includes(stateName(task.machine?.value)) &&
            idsEqual(reviewData.crossCheckerId, crossCheckerId)
        ) {
            return task;
        }
        const fromBacklogs: Backlog[] = ["selectCrossChecker", "selectReviewer"];
        const sent = await this.reviewTaskQueue.transitionAtomically(
            {
                _id: task._id,
                $or: [
                    { "machine.value": "reported" },
                    ...fromBacklogs.map(backlogFilter),
                ],
                [`${REVIEW_DATA}.usersId`]: { $ne: toObjectId(crossCheckerId) },
            },
            {
                $set: {
                    "machine.value": "cross-checking",
                    [`${REVIEW_DATA}.crossCheckerId`]:
                        toObjectId(crossCheckerId),
                    [`${REVIEW_DATA}.reviewerId`]: null,
                    [`${REVIEW_DATA}.crossCheckingClassification`]: "",
                    [`${REVIEW_DATA}.crossCheckingComment`]: "",
                },
            }
        );
        if (!sent) {
            throw notSent(task, "cross-checking", fromBacklogs);
        }
        // The web's sendToCrossChecking notifications
        this.notifier?.notify(sent, "crossChecker", [crossCheckerId]);
        this.notifier?.notify(
            sent,
            "crossCheckingSubmit",
            otherAssignees(sent, user)
        );
        return sent;
    }

    /**
     * Records the cross-check: the cross-checker's own label and comment.
     * Same label as the report → straight to the review backlog
     * (`selectReviewer`), the step send_to_review would take, unless
     * `mcp.task_queue.auto_send_to_review` is false (then back to
     * `reported`); different label → back to the writers (`assigned`,
     * draft) to rework, as the web's submitComment does.
     */
    async submitCrossCheck(
        user: WorkflowUser,
        task: any,
        classification: string,
        comment: string
    ) {
        const reviewData = task.machine?.context?.reviewData ?? {};
        if (!idsEqual(reviewData.crossCheckerId, user._id)) {
            throw new ForbiddenException(
                "Only the task's cross-checker can submit the cross-check"
            );
        }
        // Same rule as a cross-check submitted on the web
        assertAllowedClassification(
            task.classificationMethodology,
            classification,
            "crossCheckingClassification"
        );
        const agrees = reviewData.classification === classification;
        const toReview = agrees && this.config.autoSendToReview();
        const done = await this.reviewTaskQueue.transitionAtomically(
            {
                _id: task._id,
                "machine.value": { $in: CROSS_CHECKING_VALUES },
                [`${REVIEW_DATA}.crossCheckerId`]: toObjectId(user._id),
            },
            {
                $set: {
                    "machine.value": toReview
                        ? "selectReviewer"
                        : agrees
                        ? "reported"
                        : { assigned: "draft" },
                    [`${REVIEW_DATA}.crossCheckingClassification`]:
                        classification,
                    [`${REVIEW_DATA}.crossCheckingComment`]: comment,
                    ...(toReview
                        ? { [`${REVIEW_DATA}.reviewerId`]: null }
                        : {}),
                },
            }
        );
        if (!done) {
            throw new ConflictException(
                `Only tasks in cross-checking can be cross-checked (task is "${stateName(
                    task.machine?.value
                )}")`
            );
        }
        const saved = await this.reviewTaskService._createCrossCheckingComment(
            comment,
            comment,
            done._id as any
        );
        const linked = await this.reviewTaskQueue.updateAtomically(
            { _id: done._id },
            { $push: { [`${REVIEW_DATA}.crossCheckingComments`]: saved._id } }
        );
        this.notifier?.notify(
            done,
            "crossCheckingFinished",
            done.machine.context.reviewData.usersId ?? []
        );
        return linked ?? done;
    }

    /**
     * Moves a `reported` task to the review backlog (`selectReviewer` with
     * no reviewer), where any reviewer can claim it. Assignees or admins
     * only. Unless `mcp.task_queue.require_cross_check` is false, the report
     * must first have a cross-check that agreed with its label; with
     * `skipCrossCheck` (submit_report_to_review) that requirement is waived
     * for this call, and a task still waiting for a cross-checker nobody
     * took can be moved too, as the web's "back" from the cross-checker
     * selection does. Already in the review backlog: returned as is.
     * With `reviewerId` (checked by the caller with assertAssignable) the
     * task goes straight to that user's review (`submitted`), as picking a
     * reviewer on the web does; a task already in the review backlog passed
     * the cross-check rule on its way in.
     */
    async sendToReview(
        user: WorkflowUser,
        task: any,
        {
            skipCrossCheck = false,
            reviewerId,
        }: { skipCrossCheck?: boolean; reviewerId?: string } = {}
    ) {
        assertWriter(user, task, "send it to review");
        if (alreadySentToReview(task, reviewerId)) {
            return task;
        }
        // A task in the review backlog passed the rule on its way in
        const crossCheckWaived =
            skipCrossCheck ||
            !this.config.requireCrossCheck() ||
            inBacklog(task, "selectReviewer");
        if (!crossCheckWaived && !crossCheckAgreed(task)) {
            throw missingCrossCheck(task);
        }
        const fromBacklogs: Backlog[] = [
            ...(skipCrossCheck ? (["selectCrossChecker"] as const) : []),
            ...(reviewerId ? (["selectReviewer"] as const) : []),
        ];
        const reviewer = reviewerId ? toObjectId(reviewerId) : null;
        const sent = await this.reviewTaskQueue.transitionAtomically(
            {
                _id: task._id,
                $or: [
                    { "machine.value": "reported" },
                    ...fromBacklogs.map(backlogFilter),
                ],
                ...(reviewer
                    ? {
                          [`${REVIEW_DATA}.usersId`]: { $ne: reviewer },
                          [`${REVIEW_DATA}.crossCheckerId`]: { $ne: reviewer },
                      }
                    : {}),
            },
            {
                $set: {
                    "machine.value": reviewer ? "submitted" : "selectReviewer",
                    "machine.context.reviewData.reviewerId": reviewer,
                },
            }
        );
        if (!sent) {
            throw notSent(task, "review", fromBacklogs);
        }
        // The web's sendToReview notifications
        this.notifier?.notify(sent, "reviewSubmit", otherAssignees(sent, user));
        if (reviewerId) {
            this.notifier?.notify(sent, "reviewer", [reviewerId]);
        }
        return sent;
    }

    /**
     * Sends a task in review back to its writers (`assigned`, draft) with
     * the reviewer's comment, as the web's rejection does. The task's
     * reviewer or an admin only.
     */
    async rejectReviewTask(
        user: WorkflowUser,
        task: any,
        rejectionComment: string
    ) {
        const reviewData = task.machine?.context?.reviewData ?? {};
        if (
            !idsEqual(reviewData.reviewerId, user._id) &&
            !isAdmin(user, task.nameSpace)
        ) {
            throw new ForbiddenException(
                "Only the task's reviewer or an admin can reject it"
            );
        }
        const rejected = await this.reviewTaskQueue.transitionAtomically(
            { _id: task._id, "machine.value": "submitted" },
            {
                $set: {
                    "machine.value": { assigned: "draft" },
                    [`${REVIEW_DATA}.rejectionComment`]: rejectionComment,
                },
            }
        );
        if (!rejected) {
            throw new ConflictException(
                `Only tasks in review (submitted) can be rejected (task is "${stateName(
                    task.machine?.value
                )}")`
            );
        }
        this.notifier?.notify(
            rejected,
            "reviewRejected",
            rejected.machine.context.reviewData.usersId ?? []
        );
        return rejected;
    }

    /**
     * Publishes a `submitted` task with the web publish rules: only its
     * reviewer (or an admin) may publish, and the report must be complete.
     */
    async publishReviewTask(user: WorkflowUser, task: any) {
        const reviewData = task.machine?.context?.reviewData ?? {};
        const isReviewer = idsEqual(reviewData.reviewerId, user._id);
        if (!isReviewer && !isAdmin(user, task.nameSpace)) {
            throw new ForbiddenException(
                "Only the task's reviewer or an admin can publish it"
            );
        }
        const state = stateName(task.machine?.value);
        if (state !== "submitted") {
            throw new ConflictException(
                `Only tasks in review (submitted) can be published (task is "${state}")`
            );
        }
        const missing = missingReportFields(reviewData);
        if (missing.length) {
            throw new ConflictException(
                `Cannot publish: missing ${missing.join(", ")}`
            );
        }
        // Same rule as the web publish in ReviewTaskService
        assertAllowedClassification(
            task.classificationMethodology,
            reviewData.classification,
            "classification"
        );
        const published = await this.reviewTaskQueue.publishSubmitted(
            task._id.toString()
        );
        if (!published) {
            throw new ConflictException(
                "The task was published or moved by someone else"
            );
        }
        this.notifier?.notify(
            published,
            "reviewPublished",
            published.machine.context.reviewData.usersId ?? []
        );
        return published;
    }
}
