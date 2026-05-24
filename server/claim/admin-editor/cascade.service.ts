import { Injectable, Logger } from "@nestjs/common";
import { ClientSession, Types } from "mongoose";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { VerificationRequestService } from "../../verification-request/verification-request.service";
import { CommentService } from "../../review-task/comment/comment.service";

export interface SentenceHashRemap {
    oldDataHash: string;
    newDataHash: string;
}

export interface SentenceTargetRemap {
    oldSentenceId: Types.ObjectId | string;
    newSentenceId: Types.ObjectId | string;
}

export interface CascadeCounts {
    reviewTasksUpdated: number;
    claimReviewsUpdated: number;
    verificationRequestsUpdated: number;
    commentsUpdated: number;
}

// Atomically cascades 1→1 sentence identity changes to downstream entities.
// Must be invoked inside a TransactionHelper.runInTransaction(...) block.
@Injectable()
export class CascadeService {
    private readonly logger = new Logger(CascadeService.name);

    constructor(
        private readonly reviewTaskService: ReviewTaskService,
        private readonly claimReviewService: ClaimReviewService,
        private readonly verificationRequestService: VerificationRequestService,
        private readonly commentService: CommentService
    ) {}

    async applyOneToOneRemaps(
        hashRemaps: SentenceHashRemap[],
        sentenceTargetRemaps: SentenceTargetRemap[],
        session: ClientSession
    ): Promise<CascadeCounts> {
        const counts: CascadeCounts = {
            reviewTasksUpdated: 0,
            claimReviewsUpdated: 0,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        };

        for (const remap of hashRemaps) {
            if (remap.oldDataHash === remap.newDataHash) continue;

            counts.reviewTasksUpdated +=
                await this.reviewTaskService.cascadeUpdateDataHash(
                    remap.oldDataHash,
                    remap.newDataHash,
                    session
                );
            counts.claimReviewsUpdated +=
                await this.claimReviewService.cascadeUpdateDataHash(
                    remap.oldDataHash,
                    remap.newDataHash,
                    session
                );
            counts.verificationRequestsUpdated +=
                await this.verificationRequestService.cascadeUpdateDataHash(
                    remap.oldDataHash,
                    remap.newDataHash,
                    session
                );
        }

        for (const remap of sentenceTargetRemaps) {
            counts.commentsUpdated +=
                await this.commentService.cascadeUpdateSentenceTarget(
                    remap.oldSentenceId,
                    remap.newSentenceId,
                    session
                );
        }

        this.logger.log(
            `Cascade complete — reviewTasks=${counts.reviewTasksUpdated} ` +
                `claimReviews=${counts.claimReviewsUpdated} ` +
                `verificationRequests=${counts.verificationRequestsUpdated} ` +
                `comments=${counts.commentsUpdated}`
        );
        return counts;
    }
}
