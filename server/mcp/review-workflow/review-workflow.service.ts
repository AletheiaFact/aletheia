import {
    ConflictException,
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
import { isAssignee, toObjectId, WorkflowUser } from "./access";
import {
    ASSIGNED_VALUE,
    assignTo,
    buildClaimContext,
    claimPersonalityId,
    collectSentenceHashes,
    stateName,
} from "./machine";
import { ReviewLog } from "./review-log";
import { ReviewNotifierService } from "./review-notifier.service";
import { ReviewStages } from "./review-stages";
import { ReleaseReason, ReviewWriting } from "./review-writing";
import { WorkflowConfig } from "./workflow-guards";

export type { ReleaseReason } from "./review-writing";

export interface StartReviewTaskInput {
    claimId: string;
    dataHash: string;
    nameSpace: string;
}

/**
 * Review-task workflow driven from MCP, one task at a time. The state machine
 * itself lives in the frontend (XState); the server persists whatever
 * `machine` it receives. This service builds the machine documents the
 * frontend expects, validating the current state before each transition, and
 * writes them through ReviewTaskService so history, state events and
 * publishing stay intact. Handing out work from the queue is
 * ReviewQueueService.
 *
 * It owns taking a task (start, join) and fronts the two stages that follow:
 * `ReviewWriting` (save, submit, release) and `ReviewStages` (cross-check,
 * review, reject, publish).
 *
 * Every write is guarded on the state (and, where it matters, the caller's
 * role on the task) inside the update itself, so a stale caller gets a
 * conflict instead of overwriting someone else's change.
 */
@Injectable()
export class ReviewWorkflowService {
    private readonly config: WorkflowConfig;
    private readonly writing: ReviewWriting;
    private readonly stages: ReviewStages;

    constructor(
        @Inject("ClaimService") private readonly claimService: IClaimService,
        private readonly reviewTaskService: ReviewTaskService,
        private readonly reviewTaskQueue: ReviewTaskQueueService,
        @Optional() configService?: ConfigService,
        @Optional() notifier?: ReviewNotifierService
    ) {
        this.config = new WorkflowConfig(configService);
        this.writing = new ReviewWriting(reviewTaskQueue);
        this.stages = new ReviewStages(
            reviewTaskService,
            reviewTaskQueue,
            this.config,
            notifier
        );
    }

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
        const maxAssignees = this.config.maxAssignees();
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
        return this.writing.reviewLog(task);
    }

    saveReviewLog(user: WorkflowUser, task: any, input: ReviewLog) {
        return this.writing.saveReviewLog(user, task, input);
    }

    submitReport(user: WorkflowUser, task: any) {
        return this.writing.submitReport(user, task);
    }

    releaseTask(
        user: WorkflowUser,
        task: any,
        reason: ReleaseReason,
        note?: string
    ) {
        return this.writing.releaseTask(user, task, reason, note);
    }

    sendToCrossCheck(user: WorkflowUser, task: any) {
        return this.stages.sendToCrossCheck(user, task);
    }

    submitCrossCheck(
        user: WorkflowUser,
        task: any,
        classification: string,
        comment: string
    ) {
        return this.stages.submitCrossCheck(
            user,
            task,
            classification,
            comment
        );
    }

    sendToReview(user: WorkflowUser, task: any) {
        return this.stages.sendToReview(user, task);
    }

    /**
     * Submits the report and sends it to the review backlog in one call,
     * without a cross-check. A task already `reported` skips the submit, so a
     * retry after a failed send works.
     */
    async submitReportToReview(user: WorkflowUser, task: any) {
        const reported =
            stateName(task.machine?.value) === "reported"
                ? task
                : await this.writing.submitReport(user, task);
        return this.stages.sendToReview(user, reported, {
            skipCrossCheck: true,
        });
    }

    rejectReviewTask(user: WorkflowUser, task: any, rejectionComment: string) {
        return this.stages.rejectReviewTask(user, task, rejectionComment);
    }

    publishReviewTask(user: WorkflowUser, task: any) {
        return this.stages.publishReviewTask(user, task);
    }
}
