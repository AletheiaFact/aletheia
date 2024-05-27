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
import lookUpPersonalityties from "../mongo-pipelines/lookUpPersonalityties";
import lookupClaims from "../mongo-pipelines/lookupClaims";
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
        const pipeline = this.ClaimReviewModel.find(query)
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
                    nameSpace:
                        this.req.params.namespace ||
                        this.req.query.nameSpace ||
                        NameSpaceEnum.Main,
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

        const filteredClaimReviews = claimReviews.filter(
            (review) => review.claim
        );

        return Promise.all(
            filteredClaimReviews.map(async (review) => this.postProcess(review))
        );
    }

    async listDailyReviews(page, pageSize, order, query, latest = false) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        query.date = {
            $gte: today,
            $lt: tomorrow,
        };
        const pipeline = this.ClaimReviewModel.find(query)
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
                    nameSpace:
                        this.req.params.namespace ||
                        this.req.query.nameSpace ||
                        NameSpaceEnum.Main,
                },
            })
            .populate({
                path: "report",
                model: "Report",
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

        const filteredClaimReviews = claimReviews.filter(
            (review) => review.claim
        );

        return Promise.all(
            filteredClaimReviews.map(async (review) => this.postProcess(review))
        );
    }

    async agreggateClassification(match: any) {
        const nameSpace = this.req.params.namespace || this.req.query.nameSpace;

        const claimReviews = await this.ClaimReviewModel.find(match).populate({
            path: "claim",
            model: "Claim",
            match: {
                "claim.isHidden": false,
                "claim.nameSpace": nameSpace || NameSpaceEnum.Main,
            },
        });

        return this.sortReviewStats(claimReviews);
    }

    async count(query: any = {}) {
        const aggregation = [];

        aggregation.push(
            { $match: query },
            lookUpPersonalityties(TargetModel.ClaimReview),
            lookupClaims(TargetModel.ClaimReview),
            { $unwind: "$claim" },
            {
                $match: {
                    "personality.isDeleted": false,
                    "claim.isHidden": query.isHidden,
                    "claim.isDeleted": false,
                    "claim.nameSpace":
                        this.req.params.namespace ||
                        this.req.query.nameSpace ||
                        NameSpaceEnum.Main,
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
     * @returns Return a new claim review object.
     */
    async create(claimReview, data_hash) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        const review = await this.getReviewByDataHash(data_hash);

        if (review) {
            throw new Error("This Claim already has a review");
            //TODO: verify if already start a review and isn't published
        } else {
            // Cast ObjectId
            claimReview.personality = claimReview.personality
                ? Types.ObjectId(claimReview.personality)
                : null;
            claimReview.claim = Types.ObjectId(claimReview.claim);
            claimReview.usersId = claimReview.report.usersId.map((userId) => {
                return Types.ObjectId(userId);
            });
            claimReview.report = Types.ObjectId(claimReview.report._id);
            claimReview.data_hash = data_hash;
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
                claimReview?.report
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

        const content = isContentImage
            ? await this.imageService.getByDataHash(data_hash)
            : await this.sentenceService.getByDataHash(data_hash);

        let reviewHref =
            nameSpace !== NameSpaceEnum.Main
                ? `/${nameSpace}/claim/${review.claim.latestRevision.claimId}`
                : `/claim/${review.claim.latestRevision.claimId}`;

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
    getHtmlFromSchema(schema) {
        const htmlContent = this.editorParseService.schema2html(schema);
        return {
            ...schema,
            ...htmlContent,
        };
    }
}
