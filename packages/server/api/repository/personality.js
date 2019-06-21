'use strict';

const mongoose = require('mongoose');
const Personality = mongoose.model('Personality');

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

    static getPersonalityId(personalityId) {
        return Personality.findById(personalityId).populate('speechs', '_id title');
    }

    static async update(personalityId, personalityBody) {
        const personality = await this.getPersonalityId(personalityId);
        const newPersonality = Object.assign(personality, personalityBody);
        return Personality.findByIdAndUpdate(personalityId, newPersonality, { new: true });
    }

    static delete(personalityId) {
        return Personality.findByIdAndRemove(personalityId);
    }
   
};
