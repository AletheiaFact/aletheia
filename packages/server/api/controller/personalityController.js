'use strict';

const PersonalityRepository = require('../repository/personality');

module.exports = class PersonalityController {
    listAll() {
        return new Promise((resolve, reject) => {
            PersonalityRepository.listAll()
                .then(resolve)
                .catch(reject);
        });
    }

    create(body) {
        return new Promise((resolve, reject) => {
            PersonalityRepository.create(body)
                .then(resolve)
                .catch(reject);
        });
    }

    getPersonalityId(id) {
        return new Promise((resolve, reject) => {
            PersonalityRepository.getById(id)
                .then(resolve)
                .catch(reject);
        });
    }

    update(id, body) {
        return new Promise((resolve, reject) => {
            PersonalityRepository.update(id, body)
                .then(resolve)
                .catch(reject);
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            PersonalityRepository.delete(id)
                .then(() => {
                    resolve({ message: 'Personality successfully deleted' });
                })
                .catch(reject);
        });
    }
};
