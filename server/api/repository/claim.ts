import Parser from "../../lib/parser";
const Claim = require("../model/claimModel");
const ClaimReview = require("../model/claimReviewModel");
const Personality = require("../model/personalityModel");
const util = require("../../lib/util");
const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class ClaimRepository
 */
module.exports = class ClaimRepository {
    static listAll() {
        return Claim.find({}).lean();
    }

    static create(claim) {
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

    static async getById(claimId) {
        const claim = await Claim.findById(claimId)
            .populate("personality", "_id name")
            .populate("claimReviews", "_id classification")
            .populate("sources", "_id link classification");

        return await this.postProcess(claim.toObject());
    }

    private static async postProcess(personality) {
        if (personality) {
            const stats = await this.getReviewStats(personality._id);
            return Object.assign(personality, { stats });
        }

        return personality;
    }

    static async getReviewStats(id) {
        const claim = await Claim.findById(id);
        const reviews = await ClaimReview.aggregate([
            { $match: { claim: claim._id } },
            { $group: { _id: "$classification", count: { $sum: 1 } } }
        ]);
        return util.formatStats(reviews);
    }

    static async update(claimId, claimBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const claim = await this.getById(claimId);
            const p = new Parser();
            claimBody.content = p.parse(claimBody.content);
            const newClaim = Object.assign(claim, claimBody);
            const claimUpdate = await Claim.findByIdAndUpdate(
                claimId,
                newClaim,
                optionsToUpdate
            );
            return claimUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    static delete(claimId) {
        return Claim.findByIdAndRemove(claimId);
    }
};
