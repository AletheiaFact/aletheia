'use strict';

const ClaimRespository = require('../repository/claim');

module.exports = class ClaimController {
    listAll() {
        return new Promise((resolve, reject) => {
            ClaimRespository.listAll()
                .then(resolve)
                .catch(reject);
        });
    }

    create(body) {
        return new Promise((resolve, reject) => {
            ClaimRespository.create(body)
                .then(resolve)
                .catch(reject);
        });
    }

    getClaimId(id) {
        return new Promise((resolve, reject) => {
            ClaimRespository.getById(id)
                .then(resolve)
                .catch(reject);
        });
    }

    async update(id, body) {
        try {
            return ClaimRespository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            ClaimRespository.delete(id)
                .then(() => {
                    resolve({ message: 'claim successfully deleted' });
                })
                .catch(reject);
        });
    }
};
