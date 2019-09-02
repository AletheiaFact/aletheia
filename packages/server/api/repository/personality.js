'use strict';

const Personality = require('../model/personalityModel');

const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class PersonalityRepository
 */
module.exports = class PersonalityRepository {
    static listAll() {
        return Personality.find({}).lean();
    }

    static create(personality) {
        const newPersonality = new Personality(personality);
        return newPersonality.save();
    }

    static getById(personalityId) {
        return Personality.findById(personalityId).populate('speechs', '_id title');
    }

    static async update(personalityId, personalityBody) {
        try {
            const personality = await this.getById(personalityId);
            const newPersonality = Object.assign(personality, personalityBody);
            const personalityUpdate = await Personality.findByIdAndUpdate(
                personalityId,
                newPersonality,
                optionsToUpdate
            );
            return personalityUpdate;
        } catch (error) {
            throw error;
        }
    }

    static delete(personalityId) {
        return Personality.findByIdAndRemove(personalityId);
    }
};
