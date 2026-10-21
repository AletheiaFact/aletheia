import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ClaimService } from "../claim/claim.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../types/enums";

export interface StartReviewTaskInput {
    claimId: string;
    dataHash: string;
    nameSpace: string;
}

// Sentences are the leaves of a claim's content tree: paragraphs also carry
// a data_hash, but their `content` is an array rather than a string.
function collectSentenceHashes(node: any, found: string[] = []): string[] {
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

// Mirrors getInitialContext(ReviewTaskTypeEnum.Claim, { usersId }) from
// src/machines/reviewTask/context.ts, which the frontend uses to hydrate its
// XState machine. A parity spec keeps the two in sync.
export function buildClaimContext(userId: string, claimId: string) {
    return {
        reviewData: {
            usersId: [userId],
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
            personality: "",
            usersId: "",
            targetId: claimId,
            target: claimId,
            isPartialReview: false,
        },
    };
}

/**
 * Review-task workflow driven from MCP. The state machine itself lives in the
 * frontend (XState); the server persists whatever `machine` it receives. This
 * service builds the machine documents the frontend expects, validating the
 * current state before each transition, and writes them through
 * ReviewTaskService so history, state events and publishing stay intact.
 */
@Injectable()
export class ReviewWorkflowService {
    constructor(
        private readonly claimService: ClaimService,
        private readonly reviewTaskService: ReviewTaskService
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
            throw new ConflictException(
                "A review task already exists for this sentence"
            );
        }

        return this.reviewTaskService.create({
            data_hash: dataHash,
            reportModel: ReportModelEnum.FactChecking,
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace,
            target: claimId,
            recaptcha: "",
            machine: {
                value: "assigned",
                context: buildClaimContext(user._id, claimId),
            },
        } as any);
    }
}
