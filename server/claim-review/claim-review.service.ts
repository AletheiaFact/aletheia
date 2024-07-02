import { Inject, Injectable, Scope } from "@nestjs/common";
import { LeanDocument, Model, Types } from "mongoose";
import {
    ClaimReview,
    ClaimReviewDocument,
} from "./schemas/claim-review.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import { ReportDocument } from "../report/schemas/report.schema";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../types";
import { ImageService } from "../claim/types/image/image.service";
import { ContentModelEnum } from "../types/enums";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { EditorParseService } from "../editor-parse/editor-parse.service";

@Injectable({ scope: Scope.REQUEST })
export class ClaimReviewService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(ClaimReview.name)
        private ClaimReviewModel: Model<ClaimReviewDocument> &
            ISoftDeletedModel<ClaimReviewDocument>,
        private historyService: HistoryService,
        private util: UtilService,
        private sentenceService: SentenceService,
        private imageService: ImageService,
        private editorParseService: EditorParseService
    ) {}

    async listAll(page, pageSize, order, query, latest = false) {
        // Currently only list claim reviews
        const pipeline = this.ClaimReviewModel.find({
            ...query,
            source: { $exists: false },
        })
            .sort(latest ? { date: -1 } : { _id: order === "asc" ? 1 : -1 })
            .populate({
                path: "claim",
                model: "Claim",
                populate: {
                    path: "latestRevision",
                    model: "ClaimRevision",
                },
                match: {
                    isDeleted: false,
                },
            })
            .skip(page * pageSize)
            .limit(parseInt(pageSize));

        const personalityPopulateOptions: any = {
            path: "personality",
            model: "Personality",
            match: {
                isDeleted: false,
            },
        };

        if (!query.isHidden) {
            personalityPopulateOptions.match = {
                $or: [
                    { personality: { $exists: false } },
                    { isHidden: { $ne: true } },
                ],
            };
        }

        const claimReviews = await pipeline
            .populate(personalityPopulateOptions)
            .exec();

        return Promise.all(
            claimReviews.map(async (review) => this.postProcess(review))
        );
    }

    async listDailyClaimReviews(query) {
        const pipeline = this.ClaimReviewModel.find(query)
            .sort({ _id: 1 })
            .populate({
                path: "claim",
                model: "Claim",
                populate: {
                    path: "latestRevision",
                    model: "ClaimRevision",
                },
                match: {
                    isDeleted: false,
                },
            })
            .populate({
                path: "report",
                model: "Report",
                match: {
                    isDeleted: false,
                },
            });

        const personalityPopulateOptions: any = {
            path: "personality",
            model: "Personality",
            match: {
                isDeleted: false,
            },
        };

        if (!query.isHidden) {
            personalityPopulateOptions.match = {
                $or: [
                    { personality: { $exists: false } },
                    { isHidden: { $ne: true } },
                ],
            };
        }

        const claimReviews = await pipeline
            .populate(personalityPopulateOptions)
            .exec();

        return Promise.all(
            claimReviews.map(async (review) => this.postProcess(review))
        );
    }

    async agreggateClassification(match: any) {
        const claimReviews = await this.ClaimReviewModel.find(match).populate({
            path: "claim",
            model: "Claim",
            match: {
                "claim.isHidden": false,
                "claim.isDeleted": false,
            },
        });

        return this.sortReviewStats(claimReviews);
    }

    async count(query: any = {}) {
        const aggregation = [];

        aggregation.push(
            { $match: query },
            {
                $lookup: {
                    from: "personalities",
                    localField: "personality",
                    foreignField: "_id",
                    as: "personality",
                },
            },
            {
                $lookup: {
                    from: "claims",
                    localField: "claim",
                    foreignField: "_id",
                    as: "claim",
                },
            },
            { $unwind: "$claim" },
            {
                $match: {
                    "personality.isDeleted": false,
                    "claim.isHidden": query.isHidden,
                    "claim.isDeleted": false,
                },
            }
        );

        if (!query.isHidden) {
            aggregation.push({
                $match: {
                    $or: [
                        { personality: { $exists: false } },
                        { "personality.isHidden": { $ne: true } },
                    ],
                },
            });
        }
        aggregation.push({ $count: "totalCount" });

        const claimReviews = await this.ClaimReviewModel.aggregate(aggregation);

        return claimReviews.length > 0 ? claimReviews[0].totalCount : 0;
    }

    async getReviewStatsByClaimId(claimId) {
        const reviews = await this.ClaimReviewModel.find({
            claim: claimId,
            isDeleted: false,
            isPublished: true,
            isHidden: false,
            nameSpace: this.req.params.namespace || NameSpaceEnum.Main,
        });
        const sortedReviews = this.sortReviewStats(reviews);
        return this.util.formatStats(sortedReviews);
    }

    /**
     * get all personality claim claimIDs
     * @param claimId claim Id
     * @returns
     */
    async getReviewsByClaimId(claimId) {
        const classificationCounts = {};
        const claimReviews = await this.ClaimReviewModel.find({
            claim: claimId,
            isDeleted: false,
            isPublished: true,
            isHidden: false,
            nameSpace: this.req.params.namespace || NameSpaceEnum.Main,
        });

        claimReviews.forEach((review) => {
            const key = JSON.stringify({
                data_hash: review.data_hash,
                classification: review.report.classification,
            });
            classificationCounts[key] = (classificationCounts[key] || 0) + 1;
        });

        return Object.entries(classificationCounts).map(([key, count]) => {
            const { data_hash, classification } = JSON.parse(key);
            return {
                _id: { data_hash, classification: [classification] },
                count: count as number,
            };
        });
    }

    /**
     * This function creates a new claim review.
     * Also creates a History Module that tracks creation of claim reviews.
     * @param claimReview ClaimReviewBody received of the client.
     * @param data_hash unique claim review task hash
     * @param reportModel FactChecking or InformativeNews
     * @returns Return a new claim review object.
     */
    async create(claimReview, data_hash, reportModel) {
        if (claimReview.personality) {
            claimReview.personality = Types.ObjectId(claimReview.personality);
        }

        if (claimReview.target) {
            claimReview.target = Types.ObjectId(claimReview.target);
        }

        claimReview.usersId = claimReview.report.usersId.map((userId) => {
            return Types.ObjectId(userId);
        });
        claimReview.report = Types.ObjectId(claimReview.report._id);
        claimReview.data_hash = data_hash;
        claimReview.reportModel = reportModel;
        claimReview.date = new Date();
        const newClaimReview = new this.ClaimReviewModel(claimReview);
        newClaimReview.isPublished = true;
        newClaimReview.isPartialReview = claimReview.isPartialReview;

        const history = this.historyService.getHistoryParams(
            newClaimReview._id,
            TargetModel.ClaimReview,
            claimReview.usersId,
            HistoryType.Create,
            newClaimReview
        );

        this.historyService.createHistory(history);

        return newClaimReview.save();
    }

    getById(claimReviewId) {
        return this.ClaimReviewModel.findById(claimReviewId)
            .populate("claims", "_id title")
            .populate("sources", "_id href classification");
    }

    async getReviewByDataHash(
        data_hash: string
    ): Promise<LeanDocument<ClaimReviewDocument>> {
        const claimReview = await this.ClaimReviewModel.findOne({ data_hash })
            .populate("report")
            .lean();

        if (claimReview?.report) {
            claimReview.report = await this.getHtmlFromSchema(
                claimReview?.report,
                claimReview?.reportModel
            );
        }

        return claimReview;
    }

    async getReport(match): Promise<LeanDocument<ReportDocument>> {
        const claimReview = await this.ClaimReviewModel.findOne(match).lean();
        return claimReview.report;
    }

    /**
     * This function does a soft deletion, doesn't delete claim review in DataBase,
     * but omit its in the front page
     * Also creates a History Module that tracks deletion of claim reviews.
     * @param claimReviewId claimId Claim id which wants to delete
     * @returns Returns the claim review with the param isDeleted equal to true
     */
    async delete(claimReviewId) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        const claimReview = await this.getById(claimReviewId);
        const history = this.historyService.getHistoryParams(
            claimReview._id,
            TargetModel.ClaimReview,
            claimReview.usersId,
            HistoryType.Delete,
            null,
            claimReview
        );
        this.historyService.createHistory(history);
        return this.ClaimReviewModel.softDelete({ _id: claimReviewId });
    }

    async hideOrUnhideReview(_id, hide, description) {
        const review = await this.getById(_id);
        const newReview = {
            ...review.toObject(),
            ...{
                report: review?.report?._id,
                isHidden: hide,
                description: hide ? description : undefined,
            },
        };

        const before = { isHidden: !hide };
        const after = hide
            ? { isHidden: hide, description }
            : { isHidden: hide };

        const history = this.historyService.getHistoryParams(
            newReview._id,
            TargetModel.ClaimReview,
            this.req?.user,
            hide ? HistoryType.Hide : HistoryType.Unhide,
            after,
            before
        );
        this.historyService.createHistory(history);

        return this.ClaimReviewModel.updateOne({ _id: review._id }, newReview);
    }

    private async postProcess(review) {
        const { personality, data_hash, report } = review;
        const nameSpace =
            this.req.params.namespace ||
            this.req.query.nameSpace ||
            NameSpaceEnum.Main;
        const claim = {
            contentModel: review.claim.latestRevision.contentModel,
            date: review.claim.latestRevision.date,
        };

        const isContentImage = claim.contentModel === ContentModelEnum.Image;
        const isContentDebate = claim.contentModel === ContentModelEnum.Debate;
        const isContentInformativeNews =
            claim.contentModel === ContentModelEnum.Unattributed;

        const content = isContentImage
            ? await this.imageService.getByDataHash(data_hash)
            : await this.sentenceService.getByDataHash(data_hash);

        let reviewHref =
            nameSpace !== NameSpaceEnum.Main
                ? `/${nameSpace}/claim/${review.claim.latestRevision.claimId}`
                : `/claim/${review.claim.latestRevision.claimId}`;

        if (isContentInformativeNews) {
            reviewHref =
                nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/claim/${review.claim.slug}`
                    : `/claim/${review.claim.slug}`;
        }

        if (personality) {
            reviewHref =
                nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/personality/${personality?.slug}/claim/${review.claim.slug}`
                    : `/personality/${personality?.slug}/claim/${review.claim.slug}`;
        }

        reviewHref += isContentImage
            ? `/image/${data_hash}`
            : `/sentence/${data_hash}`;
        if (isContentDebate) {
            reviewHref =
                nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/claim/${review.claim.latestRevision.claimId}/debate`
                    : `/claim/${review.claim.latestRevision.claimId}/debate`;
        }

        return {
            content,
            personality,
            reviewHref,
            claim,
            report,
        };
    }

    private sortReviewStats(claimReviews) {
        const classificationCounts = claimReviews.reduce((acc, review) => {
            const classification = review.report.classification;
            acc[classification] = (acc[classification] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(classificationCounts)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .map(([classification, count]) => ({
                _id: [classification],
                count: count as number,
            }));
    }
    getHtmlFromSchema(schema, reportModel) {
        const htmlContent = this.editorParseService.schema2html(
            schema,
            reportModel
        );
        return {
            ...schema,
            ...htmlContent,
        };
    }
}
