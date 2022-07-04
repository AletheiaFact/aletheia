import { Injectable, Logger } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ClaimReview, ClaimReviewDocument } from "./schemas/claim-review.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";
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
        private util: UtilService
    ) {}

    agreggateClassification(match: any) {
        return this.ClaimReviewModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'reports',
                    localField: 'report',
                    foreignField: '_id',
                    as: 'report'
                }
            },
            { $group: { _id: "$report.classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
    }

    count(query: any = {}) {
        return this.ClaimReviewModel.countDocuments().where(query);
    }

    async getReviewStatsBySentenceHash(match: any) {
        const reviews = await this.ClaimReviewModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'reports',
                    localField: 'report',
                    foreignField: '_id',
                    as: 'report'
                }
            },
            { $group: { _id: "$report.classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return this.util.formatStats(reviews);
    }

    async getReviewStatsByClaimId(claimId) {
        const reviews = await this.ClaimReviewModel.aggregate([
            { $match: { claim: claimId, isDeleted: false, isPublished: true, } },
            {
                $lookup: {
                    from: 'reports',
                    localField: 'report',
                    foreignField: '_id',
                    as: 'report'
                }
            },
            { $group: { _id: "$report.classification", count: { $sum: 1 } } },
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
            { $match: { claim: claimId, isDeleted: false, isPublished: true } },
            {
                $lookup: {
                    from: 'reports',
                    localField: 'report',
                    foreignField: '_id',
                    as: 'report'
                }
            },
            {
                $group: {
                    _id: {sentence_hash: "$sentence_hash", classification: "$report.classification"},
                    count: { $sum: 1 }
                },
            },
        ]).option({ serializeFunctions: true });
    }

    async getUserReviewBySentenceHash(sentence_hash) {
        const user = await this.ClaimReviewModel.findOne(
            { sentence_hash, isDeleted: false, isPublished: true },
            {
                userId: 1,
            }
        );
        const userReview = user?.userId
        return userReview
    }



    /**
     * This function creates a new claim review.
     * Also creates a History Module that tracks creation of claim reviews.
     * @param claimReview ClaimReviewBody received of the client.
     * @returns Return a new claim review object.
     */
    async create(claimReview, sentence_hash) {
        const review = await this.getReviewBySentenceHash(claimReview.sentence_hash)

        if (review.length) {
            throw new Error("This Claim already has a review");
            //TODO: verify if already start a review and isn't published
        } else {
            // Cast ObjectId
            claimReview.personality = Types.ObjectId(claimReview.personality);
            claimReview.claim = Types.ObjectId(claimReview.claim);
            claimReview.report = Types.ObjectId(claimReview.report._id)
            claimReview.userId = Types.ObjectId(claimReview.userId)
            claimReview.sentence_hash = sentence_hash
            const newClaimReview = new this.ClaimReviewModel(claimReview)

            newClaimReview.isPublished = true

            const history = 
                this.historyService.getHistoryParams(
                    newClaimReview._id,
                    TargetModel.ClaimReview,
                    claimReview.userId,
                    HistoryType.Create,
                    newClaimReview
                )

            this.historyService.createHistory(history)

            return newClaimReview.save();
        }
    }

    getById(claimReviewId) {
        return this.ClaimReviewModel.findById(claimReviewId)
            .populate("claims", "_id title")
            .populate("sources", "_id link classification");
    }

    getReviewBySentenceHash(sentence_hash) {
        return this.ClaimReviewModel.aggregate([
            { $match: { sentence_hash } },
        ])
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
                claimReview.userId,
                HistoryType.Delete,
                null,
                claimReview
            )
        this.historyService.createHistory(history)
        return this.ClaimReviewModel.softDelete({ _id: claimReviewId });
    }
}