import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
    ClaimReview,
    ClaimReviewDocument,
} from "./schemas/claim-review.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";

@Injectable()
export class ClaimReviewService {
    constructor(
        @InjectModel(ClaimReview.name)
        private ClaimReviewModel: Model<ClaimReviewDocument>,
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
}
