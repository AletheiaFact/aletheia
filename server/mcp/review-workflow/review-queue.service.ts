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
import { ReportModelEnum, ReviewTaskTypeEnum } from "../../types/enums";
import { isAdmin, isReviewerOrAdmin, toObjectId, WorkflowUser } from "./access";
import {
    assignTo,
    buildClaimContext,
    claimPersonalityId,
    collectSentenceHashes,
    CROSS_CHECKING_VALUES,
} from "./machine";
import { ReviewNotifierService } from "./review-notifier.service";

const DEFAULT_MAX_OPEN_PER_USER = 1;
const DEFAULT_MAX_RELEASES = 2;

/**
 * The fact-checking work queue: feeding it and handing out work.
 *
 * Every hand-out of shared work (next task, next cross-check, next review)
 * is one guarded findOneAndUpdate on the source state, so concurrent callers
 * can never receive the same task.
 */
@Injectable()
export class ReviewQueueService {
    constructor(
        @Inject("ClaimService") private readonly claimService: IClaimService,
        private readonly reviewTaskQueue: ReviewTaskQueueService,
        @Optional() private readonly configService?: ConfigService,
        @Optional() private readonly notifier?: ReviewNotifierService
    ) {}

    /**
     * Queue feed: creates an `unassigned` task for every sentence of the
     * claim that has none yet. Idempotent on data_hash. Returns the number
     * of tasks created.
     */
    async enqueueClaimSentences(
        claimId: string,
        nameSpace: string
    ): Promise<number> {
        const claim: any = await this.claimService.getById(claimId, nameSpace);
        if (!claim) {
            throw new NotFoundException(`Claim ${claimId} not found`);
        }
        const personality = claimPersonalityId(claim);
        let created = 0;
        for (const dataHash of collectSentenceHashes(claim)) {
            const context = buildClaimContext([], claimId, personality);
            const inserted = await this.reviewTaskQueue.enqueueUnassigned({
                data_hash: dataHash,
                reportModel: ReportModelEnum.FactChecking,
                reviewTaskType: ReviewTaskTypeEnum.Claim,
                nameSpace,
                target: claimId,
                machine: { value: "unassigned", context } as any,
            });
            if (inserted) created++;
        }
        return created;
    }

    /**
     * Takes the oldest `unassigned` task in the namespace and assigns it to
     * the caller. Non-admins may hold at most `mcp.task_queue.max_open_per_user`
     * tasks being written at once (a soft cap: checked before the hand-out).
     * Tasks the caller gave back, and tasks given back
     * `mcp.task_queue.max_releases` times, are skipped.
     */
    async nextReviewTask(user: WorkflowUser, nameSpace: string) {
        const userId = toObjectId(user._id);
        if (!isAdmin(user, nameSpace)) {
            const maxOpen = this.configNumber(
                "max_open_per_user",
                DEFAULT_MAX_OPEN_PER_USER
            );
            const open = await this.reviewTaskQueue.countMatching({
                ...this.queueScope(nameSpace),
                "machine.value.assigned": { $exists: true },
                "machine.context.reviewData.usersId": userId,
            });
            if (open >= maxOpen) {
                throw new ConflictException(
                    `You already have ${open} task(s) being written; submit or release them first (list_review_tasks mine=assigned)`
                );
            }
        }
        const maxReleases = this.configNumber(
            "max_releases",
            DEFAULT_MAX_RELEASES
        );
        return this.reviewTaskQueue.transitionAtomically(
            {
                ...this.queueScope(nameSpace),
                "machine.value": "unassigned",
                "machine.context.reviewData.releases.userId": { $ne: userId },
                [`machine.context.reviewData.releases.${maxReleases - 1}`]: {
                    $exists: false,
                },
            },
            assignTo(user._id)
        );
    }

    /**
     * Takes the oldest task in the cross-check backlog and makes the caller
     * its cross-checker (`cross-checking`). Never a task the caller is an
     * assignee of: the manual requires another checker.
     */
    async claimCrossCheck(user: WorkflowUser, nameSpace: string) {
        const crossCheckerId = toObjectId(user._id);
        const task = await this.reviewTaskQueue.transitionAtomically(
            {
                ...this.queueScope(nameSpace),
                "machine.value": "selectCrossChecker",
                "machine.context.reviewData.crossCheckerId": null,
                "machine.context.reviewData.usersId": { $ne: crossCheckerId },
            },
            {
                $set: {
                    "machine.value": "cross-checking",
                    "machine.context.reviewData.crossCheckerId": crossCheckerId,
                },
            }
        );
        if (task) {
            this.notifier?.notify(
                task,
                "crossCheckingSubmit",
                task.machine.context.reviewData.usersId ?? []
            );
        }
        return task;
    }

    /**
     * Takes the oldest task in the review backlog, makes the caller its
     * reviewer and moves it to `submitted`. Reviewers and admins only, and
     * never a task the caller wrote or cross-checked (four-eyes).
     */
    async claimReviewTask(user: WorkflowUser, nameSpace: string) {
        if (!isReviewerOrAdmin(user, nameSpace)) {
            throw new ForbiddenException(
                `Only reviewers or admins can claim a review in namespace "${nameSpace}"`
            );
        }
        const reviewerId = toObjectId(user._id);
        return this.reviewTaskQueue.transitionAtomically(
            {
                ...this.queueScope(nameSpace),
                "machine.value": "selectReviewer",
                "machine.context.reviewData.reviewerId": null,
                "machine.context.reviewData.usersId": { $ne: reviewerId },
                "machine.context.reviewData.crossCheckerId": {
                    $ne: reviewerId,
                },
            },
            {
                $set: {
                    "machine.value": "submitted",
                    "machine.context.reviewData.reviewerId": reviewerId,
                },
            }
        );
    }

    /** The caller's oldest cross-checking task, plus how many are waiting. */
    async nextCrossChecking(user: WorkflowUser, nameSpace: string) {
        const filter = {
            ...this.queueScope(nameSpace),
            "machine.value": { $in: CROSS_CHECKING_VALUES },
            "machine.context.reviewData.crossCheckerId": toObjectId(user._id),
        };
        const [[task], waiting] = await Promise.all([
            this.reviewTaskQueue.findOldest(filter),
            this.reviewTaskQueue.countMatching(filter),
        ]);
        return { task: task ?? null, waiting };
    }

    /** Tasks in review (`submitted`) where the caller is the reviewer, oldest first. */
    async listMyReviewTasks(
        user: WorkflowUser,
        nameSpace: string,
        page: number,
        pageSize: number
    ) {
        const filter = {
            ...this.queueScope(nameSpace),
            "machine.value": "submitted",
            "machine.context.reviewData.reviewerId": toObjectId(user._id),
        };
        const [tasks, total] = await Promise.all([
            this.reviewTaskQueue.findOldest(filter, page, pageSize),
            this.reviewTaskQueue.countMatching(filter),
        ]);
        return { tasks, total, page, pageSize };
    }

    private queueScope(nameSpace: string) {
        return {
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace,
            reportModel: ReportModelEnum.FactChecking,
        };
    }

    private configNumber(key: string, fallback: number): number {
        const configured = Number(
            this.configService?.get(`mcp.task_queue.${key}`)
        );
        return Number.isInteger(configured) && configured > 0
            ? configured
            : fallback;
    }
}
