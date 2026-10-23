import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    Optional,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { IClaimService } from "../../interfaces/claim.service.interface";
import { ReviewTaskQueueService } from "../../review-task/review-task-queue.service";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../../types/enums";
import {
    idsEqual,
    isAdmin,
    isAssignee,
    toObjectId,
    WorkflowUser,
} from "./access";
import {
    ASSIGNED_VALUE,
    assignTo,
    buildClaimContext,
    claimPersonalityId,
    collectSentenceHashes,
    CROSS_CHECKING_VALUES,
    stateName,
} from "./machine";
import { missingReportFields } from "./publish-rules";
import { fromStored, ReviewLog, reviewLogErrors, toStored } from "./review-log";
import { ReviewNotifierService } from "./review-notifier.service";

export interface StartReviewTaskInput {
    claimId: string;
    dataHash: string;
    nameSpace: string;
}

export type ReleaseReason =
    | "not-checkable"
    | "needs-human"
    | "duplicate"
    | "other";

const DEFAULT_MAX_ASSIGNEES = 10;

const REVIEW_DATA = "machine.context.reviewData";

/**
 * Review-task workflow driven from MCP, one task at a time. The state machine
 * itself lives in the frontend (XState); the server persists whatever
 * `machine` it receives. This service builds the machine documents the
 * frontend expects, validating the current state before each transition, and
 * writes them through ReviewTaskService so history, state events and
 * publishing stay intact. Handing out work from the queue is
 * ReviewQueueService.
 *
 * Every write is guarded on the state (and, where it matters, the caller's
 * role on the task) inside the update itself, so a stale caller gets a
 * conflict instead of overwriting someone else's change.
 */
@Injectable()
export class ReviewWorkflowService {
    constructor(
        @Inject("ClaimService") private readonly claimService: IClaimService,
        private readonly reviewTaskService: ReviewTaskService,
        private readonly reviewTaskQueue: ReviewTaskQueueService,
        @Optional() private readonly configService?: ConfigService,
        @Optional() private readonly notifier?: ReviewNotifierService
    ) {}

    /**
     * Claims a claim sentence for review: the web app treats "no task" as
     * unassigned, so starting is creating the task already `assigned` to the
     * caller (the same shape saveDraft auto-creates).
     */
    async startReviewTask(
        user: { _id: string },
        { claimId, dataHash, nameSpace }: StartReviewTaskInput
    ): Promise<unknown> {
        const claim: any = await this.claimService.getById(claimId, nameSpace);
        if (!claim) {
            throw new NotFoundException(`Claim ${claimId} not found`);
        }
        if (!collectSentenceHashes(claim).includes(dataHash)) {
            throw new NotFoundException(
                `data_hash ${dataHash} is not a sentence of claim ${claimId}`
            );
        }

        const existing = await this.reviewTaskService.getReviewTaskByDataHash(
            dataHash
        );
        if (existing) {
            // A queued (`unassigned`) task is taken, atomically, the same way
            // next_review_task takes it; anything further along is someone
            // else's work.
            const taken =
                stateName(existing.machine?.value) === "unassigned"
                    ? await this.reviewTaskQueue.transitionAtomically(
                          {
                              _id: existing._id,
                              "machine.value": "unassigned",
                          },
                          assignTo(user._id)
                      )
                    : null;
            if (!taken) {
                throw new ConflictException(
                    "A review task already exists for this sentence"
                );
            }
            return taken;
        }

        const created = await this.reviewTaskQueue.createAssigned({
            data_hash: dataHash,
            reportModel: ReportModelEnum.FactChecking,
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace,
            target: claimId,
            machine: {
                value: ASSIGNED_VALUE,
                context: buildClaimContext(
                    [toObjectId(user._id)],
                    claimId,
                    claimPersonalityId(claim)
                ),
            } as any,
        });
        if (!created) {
            // Someone created it between the lookup and the insert.
            throw new ConflictException(
                "A review task already exists for this sentence"
            );
        }
        return created;
    }

    /**
     * Adds the caller to the task's assignees while it is being written
     * (`assigned`) or waiting for review (`reported`). Joining twice is a
     * no-op.
     */
    async joinReviewTask(user: WorkflowUser, task: any) {
        if (isAssignee(task, user)) {
            return task;
        }
        const state = stateName(task.machine?.value);
        if (state !== "assigned" && state !== "reported") {
            throw new ConflictException(
                `Cannot join a task in state "${state}"; only assigned or reported tasks can be joined`
            );
        }
        const maxAssignees = this.maxAssignees();
        const assignees = task.machine?.context?.reviewData?.usersId ?? [];
        if (assignees.length >= maxAssignees) {
            throw new ConflictException(
                `Task already has the maximum of ${maxAssignees} assignees`
            );
        }
        const joined = await this.reviewTaskQueue.transitionAtomically(
            {
                _id: task._id,
                $or: [
                    { "machine.value.assigned": { $exists: true } },
                    { "machine.value": "reported" },
                ],
                // array length < maxAssignees, checked atomically
                [`machine.context.reviewData.usersId.${maxAssignees - 1}`]: {
                    $exists: false,
                },
            },
            {
                $addToSet: {
                    "machine.context.reviewData.usersId": toObjectId(user._id),
                },
            }
        );
        if (!joined) {
            throw new ConflictException(
                "The task changed state or filled up while joining; fetch it again"
            );
        }
        return joined;
    }

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
        this.assertWriter(user, task, "save the review");
        this.assertAssigned(task, "saved");

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
        const stored = await toStored(merged);

        const saved = await this.reviewTaskQueue.updateAtomically(
            this.writerFilter(user, task),
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
            throw new ConflictException(
                "The task left the writing state or you are no longer an assignee; fetch it again"
            );
        }
        return saved;
    }

    /**
     * Finishes the report: `assigned → reported`, after the same checks the
     * web runs on finishReport. Clears any earlier cross-check result, since
     * a changed report needs a new cross-check.
     */
    async submitReport(user: WorkflowUser, task: any) {
        this.assertWriter(user, task, "submit the report");
        this.assertAssigned(task, "submitted");
        const missing = missingReportFields(
            task.machine.context.reviewData ?? {}
        );
        if (missing.length) {
            throw new ConflictException(
                `Cannot submit: missing ${missing.join(", ")}`
            );
        }
        const reported = await this.reviewTaskQueue.transitionAtomically(
            this.writerFilter(user, task),
            {
                $set: {
                    "machine.value": "reported",
                    [`${REVIEW_DATA}.crossCheckingClassification`]: "",
                    [`${REVIEW_DATA}.crossCheckingComment`]: "",
                },
            }
        );
        if (!reported) {
            throw new ConflictException(
                "The task left the writing state or you are no longer an assignee; fetch it again"
            );
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
        this.assertWriter(user, task, "release the task");
        this.assertAssigned(task, "released");
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
            this.writerFilter(user, task),
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
            throw new ConflictException(
                "The task left the writing state or you are no longer an assignee; fetch it again"
            );
        }
        return released;
    }

    /**
     * Moves a `reported` task to the cross-check backlog
     * (`selectCrossChecker` with no cross-checker), where another checker
     * can claim it. Assignees or admins only.
     */
    async sendToCrossCheck(user: WorkflowUser, task: any) {
        this.assertWriter(user, task, "send it to cross-checking");
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
     * Same label as the report → back to `reported`, ready for review;
     * different label → back to the writers (`assigned`, draft) to rework,
     * as the web's submitComment does.
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
        const done = await this.reviewTaskQueue.transitionAtomically(
            {
                _id: task._id,
                "machine.value": { $in: CROSS_CHECKING_VALUES },
                [`${REVIEW_DATA}.crossCheckerId`]: toObjectId(user._id),
            },
            {
                $set: {
                    "machine.value": agrees
                        ? "reported"
                        : { assigned: "draft" },
                    [`${REVIEW_DATA}.crossCheckingClassification`]:
                        classification,
                    [`${REVIEW_DATA}.crossCheckingComment`]: comment,
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
     * must first have a cross-check that agreed with its label.
     */
    async sendToReview(user: WorkflowUser, task: any) {
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
        if (this.requireCrossCheck() && !crossCheckAgreed) {
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

    private assertWriter(user: WorkflowUser, task: any, action: string) {
        if (!isAssignee(task, user) && !isAdmin(user, task.nameSpace)) {
            throw new ForbiddenException(
                `Only an assignee of the task or an admin can ${action}`
            );
        }
    }

    private assertAssigned(task: any, action: string) {
        const state = stateName(task.machine?.value);
        if (state !== "assigned") {
            throw new ConflictException(
                `Only tasks being written (assigned) can be ${action} (task is "${state}")`
            );
        }
    }

    /** Matches the task while it is being written by `user` (any assignee for admins). */
    private writerFilter(user: WorkflowUser, task: any) {
        return {
            _id: task._id,
            "machine.value.assigned": { $exists: true },
            ...(isAdmin(user, task.nameSpace)
                ? {}
                : { [`${REVIEW_DATA}.usersId`]: toObjectId(user._id) }),
        };
    }

    private requireCrossCheck(): boolean {
        return (
            this.configService?.get("mcp.task_queue.require_cross_check") !==
            false
        );
    }

    private maxAssignees(): number {
        const configured = Number(
            this.configService?.get("mcp.task_queue.max_assignees")
        );
        return Number.isInteger(configured) && configured > 0
            ? configured
            : DEFAULT_MAX_ASSIGNEES;
    }
}
