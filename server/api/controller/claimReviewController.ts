import ClaimReviewRepository from "../repository/claimReview";

module.exports = class ClaimReviewController {
    listAll() {
        try {
            return ClaimReviewRepository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return ClaimReviewRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getClaimReviewId(id) {
        try {
            return ClaimReviewRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return ClaimReviewRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await ClaimReviewRepository.delete(id);
            return { message: "Claim Review successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
