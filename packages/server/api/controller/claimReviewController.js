'use strict';

const ClaimReviewRespository = require('../repository/claimReview');

module.exports = class ClaimReviewController {
    listAll() {
        return new Promise((resolve, reject) => {
            ClaimReviewRespository.listAll()
                .then(resolve)
                .catch(reject);
        });
    }

    create(body) {
        return new Promise((resolve, reject) => {
            ClaimReviewRespository.create(body)
                .then(resolve)
                .catch(reject);
        });
    }

    getClaimReviewId(id) {
        return new Promise((resolve, reject) => {
            ClaimReviewRespository.getById(id)
                .then(resolve)
                .catch(reject);
        });
    }

    async update(id, body) {
        try {
            return ClaimReviewRespository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            ClaimReviewRespository.delete(id)
                .then(() => {
                    resolve({ message: 'ClaimReview successfully deleted' });
                })
                .catch(reject);
        });
    }
};
