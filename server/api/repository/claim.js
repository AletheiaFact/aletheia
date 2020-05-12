const Claim = require("../model/claimModel");
const Personality = require("../model/personalityModel");
const Parser = require("../../lib/parser");

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
            const p = new Parser(claim.content);
            claim.content = p.parse();
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

    static getById(claimId) {
        return Claim.findById(claimId).populate("personality", "_id name");
    }

    static async update(claimId, claimBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const claim = await this.getById(claimId);
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
