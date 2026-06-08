import { Injectable, Logger } from "@nestjs/common";
import { ClientSession, Types } from "mongoose";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
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
        private readonly commentService: CommentService
    ) {}

    // VerificationRequest is intentionally excluded from the scoped cascade.
    // Its `data_hash` is `unique` and the schema carries no claim
    // back-reference. A pre-existing VR row matching the edited claim's hash
    // may have been ingested for a different content origin; rewriting it
    // would corrupt that VR's relation to the source it was actually about.
    // Stale-hash VR is preferable to silent cross-origin rewrite.

    async applyOneToOneRemaps(
        hashRemaps: SentenceHashRemap[],
        sentenceTargetRemaps: SentenceTargetRemap[],
        claimId: Types.ObjectId | string,
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
                    claimId,
                    session
                );
            counts.claimReviewsUpdated +=
                await this.claimReviewService.cascadeUpdateDataHash(
                    remap.oldDataHash,
                    remap.newDataHash,
                    claimId,
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
            `Cascade complete — claimId=${claimId} ` +
                `reviewTasks=${counts.reviewTasksUpdated} ` +
                `claimReviews=${counts.claimReviewsUpdated} ` +
                `verificationRequests=0 (skipped: no scope) ` +
                `comments=${counts.commentsUpdated}`
        );
        return counts;
    }
}
