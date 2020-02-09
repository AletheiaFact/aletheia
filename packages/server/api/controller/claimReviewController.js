const ClaimReviewRespository = require("../repository/claimReview");

module.exports = class ClaimReviewController {
    listAll() {
        try {
            return ClaimReviewRespository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return ClaimReviewRespository.create(body);
        } catch (error) {
            return error;
        }
    }

    getClaimReviewId(id) {
        try {
            return ClaimReviewRespository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return ClaimReviewRespository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await ClaimReviewRespository.delete(id);
            return { message: "Claim Review successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
