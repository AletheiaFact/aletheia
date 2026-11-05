import type { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import type { ClaimReviewService } from "../claim-review/claim-review.service";
import {
    ClaimReview,
    ClaimReviewDocument,
} from "../claim-review/schemas/claim-review.schema";
import type { IClaimService } from "../interfaces/claim.service.interface";
import {
    buildClaimContext,
    collectSentences,
} from "../mcp/review-workflow/machine";
import { ReviewLog, toStored } from "../mcp/review-workflow/review-log";
import { ReviewTaskQueueService } from "../review-task/review-task-queue.service";
import {
    ReviewTask,
    ReviewTaskDocument,
} from "../review-task/schemas/review-task.schema";
import { isValidSourceHref } from "../source/shared/source.rules";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../types/enums";
import { seedReviews } from "./seed-data/reviews";

// Quotes and sentence splits differ between the site and the local parser:
// match the exact text first, then a sentence that contains it.
function findSentence(claim: unknown, text: string) {
    const normalize = (value: string) => value.replace(/[“”]/g, '"').trim();
    const wanted = normalize(text);
    const sentences = collectSentences(claim);
    return (
        sentences.find((s) => normalize(s.text) === wanted) ??
        sentences.find((s) => normalize(s.text).includes(wanted))
    );
}

interface SeedReviewsDeps {
    app: INestApplication;
    contextId: any;
    log: (message: string) => void;
    claimService: IClaimService;
    claimReviewService: ClaimReviewService;
    claims: Map<string, { claimId: string; personalityId: string }>;
    authorId: string;
}

/**
 * Publishes the fact-checks in seed-data/reviews/ through the work-queue
 * publish (ReviewTaskQueueService.publishSubmitted), which creates the
 * published review task, Report and ClaimReview like the web publish does.
 * Idempotent: sentences that already have a ClaimReview are skipped.
 */
export async function seedPublishedReviews(deps: SeedReviewsDeps) {
    const { app, contextId, log, claimService, claims } = deps;
    const queue = await app.resolve(ReviewTaskQueueService, contextId, {
        strict: false,
    });
    const claimReviewModel = app.get<Model<ClaimReviewDocument>>(
        getModelToken(ClaimReview.name),
        { strict: false }
    );
    const taskModel = app.get<Model<ReviewTaskDocument>>(
        getModelToken(ReviewTask.name),
        { strict: false }
    );
    const author = new Types.ObjectId(deps.authorId);

    let published = 0;
    for (const review of seedReviews) {
        const claim = claims.get(review.claimTitle.trim());
        const content = claim
            ? await claimService.getById(claim.claimId, NameSpaceEnum.Main)
            : null;
        const sentence = findSentence(content, review.sentence);
        if (!claim || !sentence) {
            log(`Review skipped, sentence not found: "${review.sentence}"`);
            continue;
        }
        const { dataHash } = sentence;
        if (await deps.claimReviewService.getReviewByDataHash(dataHash)) {
            continue;
        }

        const context: any = buildClaimContext(
            [author],
            claim.claimId,
            claim.personalityId
        );
        context.review.isPartialReview = review.isPartial;
        // The publish rejects hrefs that older reviews were saved with.
        const sources = review.sources.filter((source) => {
            const valid = isValidSourceHref(source.href);
            if (!valid) log(`Source dropped, invalid URL: ${source.href}`);
            return valid;
        });
        Object.assign(context.reviewData, {
            ...toStored({ ...review, sources } as ReviewLog),
            classification: review.classification,
            reviewerId: author,
        });
        // A task left `submitted` by a failed publish is retried here.
        const task =
            (await queue.createAssigned({
                data_hash: dataHash,
                reportModel: review.reportModel as ReportModelEnum,
                reviewTaskType: ReviewTaskTypeEnum.Claim,
                nameSpace: NameSpaceEnum.Main,
                target: claim.claimId,
                machine: { value: "submitted", context } as any,
            })) ??
            (await taskModel.findOne({
                data_hash: dataHash,
                "machine.value": "submitted",
            }));
        if (!task) {
            log(
                `Review skipped, sentence already has a task: "${review.sentence}"`
            );
            continue;
        }
        if (!(await queue.publishSubmitted(String(task._id)))) {
            log(`Publish failed: "${review.sentence}"`);
            continue;
        }
        // Keep the original publication date instead of "now".
        await claimReviewModel.updateOne(
            { data_hash: dataHash },
            { $set: { date: new Date(review.date) } }
        );
        published++;
    }
    log(`${published} fact-check reviews published`);
}
