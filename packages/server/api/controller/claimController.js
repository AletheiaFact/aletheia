'use strict';

const ClaimRespository = require('../repository/claim');

module.exports = class ClaimController {
    listAll() {
        try {
            return ClaimRespository.listAll()
        } catch (error) {
            return error
        }
    }

    create(body) {
        try {
            return ClaimRespository.create(body)
        } catch (error) {
            return error
        }
    }

    getClaimId(id) {
        try {
            return ClaimRespository.getById(id)
        } catch (error) {
            return error
        }
    }

    async update(id, body) {
        try {
            return ClaimRespository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await ClaimRespository.delete(id);
            return { message: 'Claim successfully deleted' }
        } catch (error) {
            return error;
        }
    }
};
