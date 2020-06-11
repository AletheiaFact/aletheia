const ClaimReview = require("../model/claimReviewModel");

const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class ClaimReviewRepository
 */
export default class ClaimReviewRepository {
    static listAll() {
        return ClaimReview.find({}).lean();
    }

    static create(claimReview) {
        const newClaimReview = new ClaimReview(claimReview);
        return newClaimReview.save();
    }

    static getById(claimReviewId) {
        return ClaimReview.findById(claimReviewId)
            .populate("claims", "_id title")
            .populate("sources", "_id link classification");
    }

    static async update(claimReviewId, claimReviewBody) {
        // eslint-disable-next-line no-useless-catch
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
            // TODO: log to service-runner
            throw error;
        }
    }

    static delete(claimReviewId) {
        return ClaimReview.findByIdAndRemove(claimReviewId);
    }
}
