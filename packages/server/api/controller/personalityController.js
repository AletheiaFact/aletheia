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

    getReviewStats(id) {
        try {
            return PersonalityRepository.getReviewStats(id);
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

    async delete(id) {
        try {
            await PersonalityRepository.delete(id);
            return { message: 'Personality successfully deleted' };
        } catch (error) {
            return error;
        }
    }
};
