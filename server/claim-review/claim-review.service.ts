import { Injectable, Logger } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ClaimReview, ClaimReviewDocument } from "./schemas/claim-review.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";
import { SourceService } from "../source/source.service";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { ISoftDeletedModel } from 'mongoose-softdelete-typescript';

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

    /**
     * get all personality claim claimIDs
     * @param claimId claim Id
     * @returns 
     */
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

    async create(claimReview) {
        // Cast ObjectId
        //verificar id da claim review
        //a claim review está referenciando a claim, não à claim revision está certo ?
        claimReview.personality = new Types.ObjectId(claimReview.personality);
        claimReview.claim = new Types.ObjectId(claimReview.claim);
        claimReview.user = new Types.ObjectId(claimReview.user);
        const newClaimReview = new this.ClaimReviewModel(claimReview);
        if (claimReview.sources && Array.isArray(claimReview.sources)) {
            try {
                for (let i = 0; i < claimReview.sources.length ; i++) {
                    await this.sourceService.create({
                        link: claimReview.sources[i],
                        targetId: newClaimReview.id,
                        targetModel: "ClaimReview",
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

    async delete(claimReviewId) {
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
        console.log(claimReview)
        this.historyService.createHistory(history)
        return this.ClaimReviewModel.softDelete({ _id: claimReviewId });
    }
}