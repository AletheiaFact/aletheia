import { Injectable, Logger } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ClaimReview, ClaimReviewDocument } from "./schemas/claim-review.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";
import { SourceService } from "../source/source.service";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { ISoftDeletedModel } from 'mongoose-softdelete-typescript';
import { SourceTargetModel } from '../source/schemas/source.schema'

@Injectable()
export class ClaimReviewService {
    private readonly logger = new Logger("ClaimReviewService");
    constructor(
        @InjectModel(ClaimReview.name)
        private ClaimReviewModel: Model<ClaimReviewDocument> & ISoftDeletedModel<ClaimReviewDocument>,
        private historyService: HistoryService,
        private sourceService: SourceService,
        private util: UtilService
    ) {}

    agreggateClassification(match: any) {
        return this.ClaimReviewModel.aggregate([
            { $match: match },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
    }

    count(query: any = {}) {
        return this.ClaimReviewModel.countDocuments().where(query);
    }

    async getReviewStatsBySentenceHash(match: any) {
        const reviews = await this.ClaimReviewModel.aggregate([
            { $match: match },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return this.util.formatStats(reviews);
    }

    async getReviewStatsByClaimId(claimId) {
        const reviews = await this.ClaimReviewModel.aggregate([
            { $match: { claim: claimId, isDeleted: false } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return this.util.formatStats(reviews);
    }

    /**
     * get all personality claim claimIDs
     * @param claimId claim Id
     * @returns
     */
    getReviewsByClaimId(claimId) {
        return this.ClaimReviewModel.aggregate([
            { $match: { claim: claimId, isDeleted: false } },
            {
                $group: {
                    _id: "$sentence_hash",
                    topClassification: this._topClassificationAccumulator(),
                },
            },
        ]).option({ serializeFunctions: true });
    }

    getUserReviewBySentenceHash(sentenceHash, userId) {
        if (!userId) {
            return Promise.resolve(undefined);
        }
        return this.ClaimReviewModel.findOne(
            { sentence_hash: sentenceHash, user: userId, isDeleted: false },
            {
                sources: 1,
                _id: 1,
                classification: 1,
                user: 1,
            }
        );
    }

    countReviewsBySentenceHash(sentenceHash) {
        return this._reviewsBySentenceHashAggregated(sentenceHash).count(
            "count"
        );
    }

    getReviewsBySentenceHash(sentenceHash, page, pageSize, order) {
        pageSize = parseInt(pageSize);
        page = parseInt(page);

        return this._reviewsBySentenceHashAggregated(sentenceHash)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order });
    }

    _reviewsBySentenceHashAggregated(sentenceHash) {
        return this.ClaimReviewModel.aggregate([
            { $match: { sentence_hash: sentenceHash, isDeleted: false } },
            // Virtual Populates doesn't work with aggregate
            // https://stackoverflow.com/questions/47669178/mongoose-virtual-populate-and-aggregates
            {
                $lookup: {
                    from: 'sources',
                    localField: '_id',
                    foreignField: 'targetId',
                    as: 'sources'
                }
            },
            {
                $project: {
                    _id: 1,
                    sources: 1,
                    report: 1,
                    classification: 1,
                    user: 1,
                },
            },
        ]);
    }

    _topClassificationAccumulator() {
        return {
            $accumulator: {
                init: function () {
                    return {};
                },
                accumulate: function (state, classification) {
                    if (!state[classification]) {
                        state[classification] = 1;
                    } else {
                        state[classification]++;
                    }

                    return state;
                },
                accumulateArgs: ["$classification"],
                merge: function (state1, state2) {
                    return { ...state1, ...state2 };
                },
                finalize: function (state) {
                    // Find the classification with bigger count
                    const topClassification = Object.keys(state).reduce(
                        (acc, classification) => {
                            if (!state[acc]) {
                                return classification;
                            } else {
                                return state[acc] >= state[classification]
                                    ? acc
                                    : classification;
                            }
                        },
                        ""
                    );
                    // TODO: what can we do about ties?
                    return {
                        classification: topClassification,
                        count: state[topClassification],
                    };
                },
                lang: "js",
            },
        };
    }

    /**
     * This function creates a new claim review.
     * Also creates a History Module that tracks creation of claim reviews.
     * @param claimReview ClaimReviewBody received of the client.
     * @returns Return a new claim review object.
     */
    async create(claimReview) {
        // Cast ObjectId
        claimReview.personality = Types.ObjectId(claimReview.personality);
        claimReview.claim = Types.ObjectId(claimReview.claim);
        claimReview.user = Types.ObjectId(claimReview.user);
        const newClaimReview = new this.ClaimReviewModel(claimReview);
        if (claimReview.sources && Array.isArray(claimReview.sources)) {
            try {
                for (let i = 0; i < claimReview.sources.length ; i++) {
                    await this.sourceService.create({
                        link: claimReview.sources[i],
                        targetId: newClaimReview.id,
                        targetModel: SourceTargetModel.ClaimReview,
                    });
                }
            } catch (e) {
                this.logger.error(e);
                throw e;
            }
        }

        const history = 
            this.historyService.getHistoryParams(
                newClaimReview._id,
                TargetModel.ClaimReview,
                claimReview.user,
                HistoryType.Create,
                newClaimReview
            )

        this.historyService.createHistory(history)

        return newClaimReview.save();
    }

    getById(claimReviewId) {
        return this.ClaimReviewModel.findById(claimReviewId)
            .populate("claims", "_id title")
            .populate("sources", "_id link classification");
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
        const claimReview = await this.getById(claimReviewId)
        const history = 
            this.historyService.getHistoryParams(
                claimReview._id,
                TargetModel.ClaimReview,
                claimReview.user,
                HistoryType.Delete,
                null,
                claimReview
            )
        this.historyService.createHistory(history)
        return this.ClaimReviewModel.softDelete({ _id: claimReviewId });
    }
}