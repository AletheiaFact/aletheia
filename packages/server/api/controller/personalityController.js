'use strict';

const PersonalityRepository = require('../repository/personality');

module.exports = class PersonalityController {
    listAll() {
        try {
            return PersonalityRepository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return PersonalityRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getPersonalityId(id) {
        try {
            return PersonalityRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return PersonalityRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

<<<<<<< HEAD
    async delete(id) {
        try {
            await PersonalityRepository.delete(id);
            return { message: 'Personality successfully deleted' };
        } catch (error) {
            return error;
        }
=======
    getReviewStats(id) {
        return new Promise((resolve, reject) => {
            PersonalityRepository.getReviewStats(id)
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
>>>>>>> Run fix lint
    }
};
