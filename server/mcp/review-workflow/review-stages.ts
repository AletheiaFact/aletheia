import { ConflictException, ForbiddenException } from "@nestjs/common";
import { ReviewTaskQueueService } from "../../review-task/review-task-queue.service";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { idsEqual, isAdmin, isAssignee, toObjectId, WorkflowUser } from "./access";
import { CROSS_CHECKING_VALUES, stateName } from "./machine";
import { missingReportFields } from "./publish-rules";
import { ReviewNotifierService } from "./review-notifier.service";
import { assertWriter, REVIEW_DATA, WorkflowConfig } from "./workflow-guards";

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
     * can claim it. Assignees or admins only.
     */
    async sendToCrossCheck(user: WorkflowUser, task: any) {
        assertWriter(user, task, "send it to cross-checking");
        const sent = await this.reviewTaskQueue.transitionAtomically(
            { _id: task._id, "machine.value": "reported" },
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
            throw new ConflictException(
                `Only reported tasks can be sent to cross-checking (task is "${stateName(
                    task.machine?.value
                )}")`
            );
        }
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
     * for this call.
     */
    async sendToReview(
        user: WorkflowUser,
        task: any,
        { skipCrossCheck = false }: { skipCrossCheck?: boolean } = {}
    ) {
        if (!isAssignee(task, user) && !isAdmin(user, task.nameSpace)) {
            throw new ForbiddenException(
                "Only an assignee of the task or an admin can send it to review"
            );
        }
        const reviewData = task.machine?.context?.reviewData ?? {};
        const crossCheckAgreed =
            !!reviewData.crossCheckingClassification &&
            reviewData.crossCheckingClassification ===
                reviewData.classification;
        if (
            this.config.requireCrossCheck() &&
            !crossCheckAgreed &&
            !skipCrossCheck
        ) {
            throw new ConflictException(
                "The report needs a cross-check that agrees with its label before review; use send_to_cross_check first"
            );
        }
        const sent = await this.reviewTaskQueue.transitionAtomically(
            { _id: task._id, "machine.value": "reported" },
            {
                $set: {
                    "machine.value": "selectReviewer",
                    "machine.context.reviewData.reviewerId": null,
                },
            }
        );
        if (!sent) {
            throw new ConflictException(
                `Only reported tasks can be sent to review (task is "${stateName(
                    task.machine?.value
                )}")`
            );
        }
        const otherAssignees = (
            sent.machine.context.reviewData.usersId ?? []
        ).filter((id: unknown) => !idsEqual(id, user._id));
        this.notifier?.notify(sent, "reviewSubmit", otherAssignees);
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
