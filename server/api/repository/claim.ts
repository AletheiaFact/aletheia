import Parser from "../../lib/parser";
import { ILogger } from "../../lib/loggerInterface";

const Claim = require("../model/claimModel");
const ClaimReview = require("../model/claimReviewModel");
const Personality = require("../model/personalityModel");
const util = require("../../lib/util");

/**
 * @class ClaimRepository
 */
export default class ClaimRepository {
    optionsToUpdate: Object;
    logger: ILogger;

    constructor(logger: any = {}) {
        this.logger = logger;
        this.optionsToUpdate = {
            new: true,
            upsert: true
        };
    }

    listAll() {
        return Claim.find({}).lean();
    }

    create(claim) {
        return new Promise((resolve, reject) => {
            const p = new Parser();
            claim.content = p.parse(claim.content);
            const newClaim = new Claim(claim);
            newClaim.save((err, claim) => {
                if (err) {
                    reject(err);
                }
                Personality.findOneAndUpdate(
                    { _id: claim.personality },
                    { $push: { claims: claim } },
                    { new: true },
                    err => {
                        if (err) {
                            reject(err);
                        }
                    }
                );
            });
            resolve(newClaim);
        });
    }

    async getById(claimId) {
        const claim = await Claim.findById(claimId)
            .populate("personality", "_id name")
            .populate("claimReviews", "_id classification")
            .populate("sources", "_id link classification");

        return await this.postProcess(claim.toObject());
    }

    private async postProcess(personality) {
        if (personality) {
            const stats = await this.getReviewStats(personality._id);
            return Object.assign(personality, { stats });
        }

        return personality;
    }

    async getReviewStats(id) {
        const claim = await Claim.findById(id);
        const reviews = await ClaimReview.aggregate([
            { $match: { claim: claim._id } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        return util.formatStats(reviews);
    }

    async update(claimId, claimBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const claim = await this.getById(claimId);
            const p = new Parser();
            claimBody.content = p.parse(claimBody.content);
            const newClaim = Object.assign(claim, claimBody);
            const claimUpdate = await Claim.findByIdAndUpdate(
                claimId,
                newClaim,
                this.optionsToUpdate
            );
            return claimUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(claimId) {
        return Claim.findByIdAndRemove(claimId);
    }
}
