'use strict';

const ClaimReview = require('../model/claimReviewModel');

const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class ClaimReviewRepository
 */
module.exports = class ClaimReviewRepository {
    static listAll() {
        return ClaimReview.find({}).lean();
    }

    static create(claimReview) {
        const newClaimReview = new ClaimReview(claimReview);
        return newClaimReview.save();
    }

    static getById(claimReviewId) {
        return ClaimReview.findById(claimReviewId).populate('claims', '_id title');
    }

    static async update(claimReviewId, claimReviewBody) {
        try {
            const claimReview = await this.getById(claimReviewId);
            const newClaimReview = Object.assign(claimReview, claimReviewBody);
            const claimReviewUpdate = await ClaimReview.findByIdAndUpdate(
                claimReviewId,
                newClaimReview,
                optionsToUpdate
            );
            return claimReviewUpdate;
        } catch (error) {
            throw error;
        }
    }

    static delete(claimReviewId) {
        return ClaimReview.findByIdAndRemove(claimReviewId);
    }
};
