import { BadRequestException, ConflictException } from "@nestjs/common";
import { ReviewTaskQueueService } from "../../review-task/review-task-queue.service";
import { idsEqual, isAdmin, toObjectId, WorkflowUser } from "./access";
import { missingReportFields } from "./publish-rules";
import { fromStored, ReviewLog, reviewLogErrors, toStored } from "./review-log";
import {
    assertAssigned,
    assertWriter,
    REVIEW_DATA,
    writerFilter,
} from "./workflow-guards";

export type ReleaseReason =
    | "not-checkable"
    | "needs-human"
    | "duplicate"
    | "other";

const LEFT_WRITING_STATE =
    "The task left the writing state or you are no longer an assignee; fetch it again";

/** The writing stage: saving the review form, submitting it, giving the task back. */
export class ReviewWriting {
    constructor(private readonly reviewTaskQueue: ReviewTaskQueueService) {}

    /** The task's review form in plain text, plus what submit still needs. */
    reviewLog(task: any) {
        const reviewData = task.machine?.context?.reviewData ?? {};
        return {
            ...fromStored(reviewData),
            missing: missingReportFields(reviewData),
        };
    }

    /**
     * Saves the review form (a draft): merges `input` into the stored form,
     * rebuilds the editor document and HTML the web uses, and keeps the task
     * in `assigned` (draft). Assignees or admins only.
     */
    async saveReviewLog(user: WorkflowUser, task: any, input: ReviewLog) {
        assertWriter(user, task, "save the review");
        assertAssigned(task, "saved");

        const merged: ReviewLog = {
            ...fromStored(task.machine.context.reviewData),
        };
        for (const [key, value] of Object.entries(input)) {
            if (value !== undefined) (merged as any)[key] = value;
        }
        const errors = reviewLogErrors(merged);
        if (errors.length) {
            throw new BadRequestException(errors.join("; "));
        }
        const stored = toStored(merged);

        const saved = await this.reviewTaskQueue.updateAtomically(
            writerFilter(user, task),
            {
                $set: {
                    "machine.value": { assigned: "draft" },
                    [`${REVIEW_DATA}.classification`]:
                        merged.classification ?? "",
                    [`${REVIEW_DATA}.summary`]: stored.summary,
                    [`${REVIEW_DATA}.questions`]: stored.questions,
                    [`${REVIEW_DATA}.report`]: stored.report,
                    [`${REVIEW_DATA}.verification`]: stored.verification,
                    [`${REVIEW_DATA}.sources`]: stored.sources,
                    [`${REVIEW_DATA}.visualEditor`]: stored.visualEditor,
                    [`${REVIEW_DATA}.reviewDataHtml`]: stored.reviewDataHtml,
                },
            }
        );
        if (!saved) {
            throw new ConflictException(LEFT_WRITING_STATE);
        }
        return saved;
    }

    /**
     * Finishes the report: `assigned → reported`, after the same checks the
     * web runs on finishReport. Clears any earlier cross-check result, since
     * a changed report needs a new cross-check.
     */
    async submitReport(user: WorkflowUser, task: any) {
        assertWriter(user, task, "submit the report");
        assertAssigned(task, "submitted");
        const missing = missingReportFields(
            task.machine.context.reviewData ?? {}
        );
        if (missing.length) {
            throw new ConflictException(
                `Cannot submit: missing ${missing.join(", ")}`
            );
        }
        const reported = await this.reviewTaskQueue.transitionAtomically(
            writerFilter(user, task),
            {
                $set: {
                    "machine.value": "reported",
                    [`${REVIEW_DATA}.crossCheckingClassification`]: "",
                    [`${REVIEW_DATA}.crossCheckingComment`]: "",
                },
            }
        );
        if (!reported) {
            throw new ConflictException(LEFT_WRITING_STATE);
        }
        return reported;
    }

    /**
     * Gives a task back. The caller leaves the assignees; when nobody is
     * left the task returns to the queue. The release is recorded so the
     * queue does not hand the task straight back to the same user.
     */
    async releaseTask(
        user: WorkflowUser,
        task: any,
        reason: ReleaseReason,
        note?: string
    ) {
        assertWriter(user, task, "release the task");
        assertAssigned(task, "released");
        const userId = toObjectId(user._id);
        const assignees = task.machine.context.reviewData.usersId ?? [];
        const lastOne =
            isAdmin(user, task.nameSpace) ||
            assignees.every((id: unknown) => idsEqual(id, user._id));
        const release = {
            userId,
            reason,
            note: note ?? "",
            at: new Date(),
        };
        const released = await this.reviewTaskQueue.transitionAtomically(
            writerFilter(user, task),
            lastOne
                ? {
                      $set: {
                          "machine.value": "unassigned",
                          [`${REVIEW_DATA}.usersId`]: [],
                      },
                      $push: { [`${REVIEW_DATA}.releases`]: release },
                  }
                : {
                      $pull: { [`${REVIEW_DATA}.usersId`]: userId },
                      $push: { [`${REVIEW_DATA}.releases`]: release },
                  }
        );
        if (!released) {
            throw new ConflictException(LEFT_WRITING_STATE);
        }
        return released;
    }
}
