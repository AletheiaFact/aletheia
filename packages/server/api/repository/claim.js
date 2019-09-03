'use strict';

const Claim = require('../model/claimModel');

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
        const newClaim = new Claim(claim);
        return newClaim.save();
    }

    static getById(claimId) {
        return Claim.findById(claimId).populate('personality', '_id name');
    }

    static async update(claimId, claimBody) {
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
            throw error;
        }
    }

    static delete(claimId) {
        return Claim.findByIdAndRemove(claimId);
    }
};
