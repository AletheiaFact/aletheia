import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { targetIdFilter } from "../../common/target-id-filter";
import { ClientSession, Model, Types } from "mongoose";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { CommentService } from "../../review-task/comment/comment.service";
import {
    ClaimReview,
    ClaimReviewDocument,
} from "../../claim-review/schemas/claim-review.schema";
import {
    Report,
    ReportDocument,
} from "../../report/mongo/schemas/report.schema";
import {
    ReviewTask,
    ReviewTaskDocument,
} from "../../review-task/schemas/review-task.schema";
import { ReviewTaskTypeEnum } from "../../types/enums";

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
    reportsUpdated: number;
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
        private readonly commentService: CommentService,
        @InjectModel(ClaimReview.name)
        private readonly ClaimReviewModel: Model<ClaimReviewDocument>,
        @InjectModel(Report.name)
        private readonly ReportModel: Model<ReportDocument>,
        @InjectModel(ReviewTask.name)
        private readonly ReviewTaskModel: Model<ReviewTaskDocument>
    ) {}

    // Returns the hashes, among `hashes`, that have a published (not
    // deleted) review of this claim. Deleting such a sentence would orphan
    // a public report, so the editor refuses it. In-progress review tasks do
    // not block a deletion.
    async findPublishedHashes(
        hashes: string[],
        claimId: Types.ObjectId | string,
        session?: ClientSession
    ): Promise<string[]> {
        if (hashes.length === 0) return [];
        return this.ClaimReviewModel.distinct("data_hash", {
            data_hash: { $in: hashes },
            target: targetIdFilter(claimId),
            targetModel: "Claim",
            isDeleted: { $ne: true },
        }).session(session ?? null);
    }

    // Returns the hashes, among `hashes`, that have a review task of this
    // claim, in progress or published. The editor warns before deleting a
    // sentence whose task is still in progress.
    async findReviewTaskHashes(
        hashes: string[],
        claimId: Types.ObjectId | string,
        session?: ClientSession
    ): Promise<string[]> {
        if (hashes.length === 0) return [];
        return this.ReviewTaskModel.distinct("data_hash", {
            data_hash: { $in: hashes },
            target: targetIdFilter(claimId),
            reviewTaskType: ReviewTaskTypeEnum.Claim,
        }).session(session ?? null);
    }

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
            reportsUpdated: 0,
            verificationRequestsUpdated: 0,
            commentsUpdated: 0,
        };

        for (const remap of hashRemaps) {
            if (remap.oldDataHash === remap.newDataHash) continue;

            // Runs before the ClaimReview remap, which it reads by the old
            // hash. Sentence pages find the report by data_hash.
            counts.reportsUpdated += await this.cascadeReportDataHash(
                remap.oldDataHash,
                remap.newDataHash,
                claimId,
                session
            );

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
                `reports=${counts.reportsUpdated} ` +
                `verificationRequests=0 (skipped: no scope) ` +
                `comments=${counts.commentsUpdated}`
        );
        return counts;
    }

    // Report has no claim back-reference, so only the reports of this
    // claim's reviews are rewritten (see the VerificationRequest note).
    private async cascadeReportDataHash(
        oldHash: string,
        newHash: string,
        claimId: Types.ObjectId | string,
        session: ClientSession
    ): Promise<number> {
        const reportIds = await this.ClaimReviewModel.distinct("report", {
            data_hash: oldHash,
            target: targetIdFilter(claimId),
            targetModel: "Claim",
        }).session(session);
        if (reportIds.length === 0) return 0;

        const result = await this.ReportModel.updateMany(
            { _id: { $in: reportIds }, data_hash: oldHash },
            { $set: { data_hash: newHash } },
            { session }
        );
        return result.modifiedCount ?? 0;
    }
}
