import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import {
    ClaimReview,
    ClaimReviewDocument,
} from "./schemas/claim-review.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";
import { SourceService } from "../source/source.service";

@Injectable()
export class ClaimReviewService {
    constructor(
        @InjectModel(ClaimReview.name)
        private ClaimReviewModel: Model<ClaimReviewDocument>,
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

    async getReviewStatsBySentenceHash(sentenceHash) {
        const reviews = await this.ClaimReviewModel.aggregate([
            { $match: { sentence_hash: sentenceHash } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return this.util.formatStats(reviews);
    }

    async getReviewStatsByClaimId(claimId) {
        const reviews = await this.ClaimReviewModel.aggregate([
            { $match: { claim: claimId } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return this.util.formatStats(reviews);
    }

    getReviewsByClaimId(claimId) {
        return this.ClaimReviewModel.aggregate([
            { $match: { claim: claimId } },
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
            { sentence_hash: sentenceHash, user: userId },
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
            { $match: { sentence_hash: sentenceHash } },
            {
                $project: {
                    _id: 1,
                    sources: 1,
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

    async create(claimReview) {
        // Cast ObjectId
        claimReview.personality = new Types.ObjectId(claimReview.personality);
        claimReview.claim = new Types.ObjectId(claimReview.claim);
        claimReview.user = new Types.ObjectId(claimReview.user);
        const newClaimReview = new this.ClaimReviewModel(claimReview);
        if (claimReview.source) {
            this.sourceService.create({
                link: claimReview.source,
                targetId: newClaimReview.id,
                targetModel: "ClaimReview",
            });
        }

        return newClaimReview.save();
    }

    getById(claimReviewId) {
        return this.ClaimReviewModel.findById(claimReviewId)
            .populate("claims", "_id title")
            .populate("sources", "_id link classification");
    }

    // async update(claimReviewId, claimReviewBody) {
    //     // eslint-disable-next-line no-useless-catch
    //     try {
    //         const claimReview = await this.getById(claimReviewId);
    //         const newClaimReview = Object.assign(claimReview, claimReviewBody);
    //         const claimReviewUpdate = await ClaimReview.findByIdAndUpdate(
    //             claimReviewId,
    //             newClaimReview,
    //             this.optionsToUpdate
    //         );
    //         return claimReviewUpdate;
    //     } catch (error) {
    //         // TODO: log to service-runner
    //         throw error;
    //     }
    // }

    delete(claimReviewId) {
        return this.ClaimReviewModel.findByIdAndRemove(claimReviewId);
    }
}
