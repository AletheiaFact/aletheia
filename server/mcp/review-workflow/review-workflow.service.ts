import {
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
    collectSentenceHashes,
    stateName,
} from "./machine";
import { missingPublishFields } from "./publish-rules";
import { ReviewNotifierService } from "./review-notifier.service";

export interface StartReviewTaskInput {
    claimId: string;
    dataHash: string;
    nameSpace: string;
}

const DEFAULT_MAX_ASSIGNEES = 10;

/**
 * Review-task workflow driven from MCP, one task at a time. The state machine
 * itself lives in the frontend (XState); the server persists whatever
 * `machine` it receives. This service builds the machine documents the
 * frontend expects, validating the current state before each transition, and
 * writes them through ReviewTaskService so history, state events and
 * publishing stay intact. Handing out work from the queue is
 * ReviewQueueService.
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

        return this.reviewTaskService.create({
            data_hash: dataHash,
            reportModel: ReportModelEnum.FactChecking,
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace,
            target: claimId,
            recaptcha: "",
            machine: {
                value: ASSIGNED_VALUE,
                context: buildClaimContext([user._id], claimId),
            },
        } as any);
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

    /**
     * Moves a `reported` task to the review backlog (`selectReviewer` with
     * no reviewer), where any reviewer can claim it. Assignees or admins only.
     */
    async sendToReview(user: WorkflowUser, task: any) {
        if (!isAssignee(task, user) && !isAdmin(user, task.nameSpace)) {
            throw new ForbiddenException(
                "Only an assignee of the task or an admin can send it to review"
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
        const missing = missingPublishFields(reviewData);
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

    private maxAssignees(): number {
        const configured = Number(
            this.configService?.get("mcp.task_queue.max_assignees")
        );
        return Number.isInteger(configured) && configured > 0
            ? configured
            : DEFAULT_MAX_ASSIGNEES;
    }
}
