import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import type { IClaimService } from "../../interfaces/claim.service.interface";
import { ReviewTaskQueueService } from "../../review-task/review-task-queue.service";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../../types/enums";
import { isReviewerOrAdmin, toObjectId, WorkflowUser } from "./access";
import {
    assignTo,
    buildClaimContext,
    collectSentenceHashes,
    CROSS_CHECKING_VALUES,
} from "./machine";

/**
 * The fact-checking work queue: feeding it and handing out work.
 *
 * Every hand-out of shared work (next task, next review) is one guarded
 * findOneAndUpdate on the source state, so concurrent callers can never
 * receive the same task.
 */
@Injectable()
export class ReviewQueueService {
    constructor(
        @Inject("ClaimService") private readonly claimService: IClaimService,
        private readonly reviewTaskQueue: ReviewTaskQueueService
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
        const personality = claim.personalities?.[0];
        const personalityId = personality?._id ?? personality ?? "";
        let created = 0;
        for (const dataHash of collectSentenceHashes(claim)) {
            const context = buildClaimContext([], claimId);
            context.review.personality = personalityId
                ? personalityId.toString()
                : "";
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

    /** Takes the oldest `unassigned` task in the namespace and assigns it to the caller. */
    async nextReviewTask(user: WorkflowUser, nameSpace: string) {
        return this.reviewTaskQueue.transitionAtomically(
            { ...this.queueScope(nameSpace), "machine.value": "unassigned" },
            assignTo(user._id)
        );
    }

    /**
     * Takes the oldest task in the review backlog, makes the caller its
     * reviewer and moves it to `submitted`. Reviewers and admins only, and
     * never a task the caller is an assignee of (four-eyes).
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
}
