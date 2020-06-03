const ClaimRepository = require("../repository/claim");

module.exports = class ClaimController {
    listAll() {
        try {
            return ClaimRepository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return ClaimRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getClaimId(id) {
        try {
            return ClaimRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return ClaimRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await ClaimRepository.delete(id);
            return { message: "Claim successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
