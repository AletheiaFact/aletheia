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
import {
    ReviewLog,
    ReviewLogField,
    toStored,
} from "../mcp/review-workflow/review-log";
import { ReviewTaskQueueService } from "../review-task/review-task-queue.service";
import { isValidSourceHref } from "../source/shared/source.rules";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../types/enums";
import { seedReviews } from "./seed-data/reviews";

type SeedReport = typeof seedReviews[number]["report"];

const FIELDS: ReviewLogField[] = ["summary", "report", "verification"];

// A linked source as schema2html renders it (lib/editor-parser.ts).
const SOURCE_LINK =
    /<a href='#[^']*' rel='noopener noreferrer nofollow'>([^<]*)<sup>(\d+)<\/sup><\/a>/g;

/**
 * The published report HTML (as aletheiafact.org serves it) back to the
 * plain review log the MCP tools write, so toStored() rebuilds the stored
 * text, source links and editor document the web would have saved.
 */
export function reportToReviewLog(report: SeedReport): ReviewLog {
    const linked = new Map<
        number,
        { field: ReviewLogField; quotedText: string }
    >();
    const log: ReviewLog = {
        classification: report.classification,
        questions: report.questions,
    };
    for (const field of FIELDS) {
        log[field] = report[field]
            .replace(SOURCE_LINK, (_, quotedText: string, sup: string) => {
                linked.set(Number(sup), { field, quotedText });
                return quotedText;
            })
            .replace(/<br>|<\/p><p>/g, "\n")
            .replace(/<\/?(div|p)>/g, "");
    }
    log.sources = report.sources.map((href, index) => ({
        href,
        ...linked.get(index + 1),
    }));
    return log;
}

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
 * Publishes the fact-checks in seed-data/reviews.ts through the work-queue
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
        const reviewLog = reportToReviewLog(review.report);
        reviewLog.sources = (reviewLog.sources ?? []).filter((source) => {
            const valid = isValidSourceHref(source.href);
            if (!valid) log(`Source dropped, invalid URL: ${source.href}`);
            return valid;
        });
        Object.assign(context.reviewData, {
            ...toStored(reviewLog),
            classification: review.cls,
            reviewerId: author,
        });
        const task = await queue.createAssigned({
            data_hash: dataHash,
            reportModel: review.reportModel as ReportModelEnum,
            reviewTaskType: ReviewTaskTypeEnum.Claim,
            nameSpace: NameSpaceEnum.Main,
            target: claim.claimId,
            machine: { value: "submitted", context } as any,
        });
        if (!task) {
            log(
                `Review skipped, sentence already has a task: "${review.sentence}"`
            );
            continue;
        }
        await queue.publishSubmitted(String(task._id));
        // Keep the original publication date instead of "now".
        await claimReviewModel.updateOne(
            { data_hash: dataHash },
            { $set: { date: new Date(review.date) } }
        );
        published++;
    }
    log(`${published} fact-check reviews published`);
}
