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
    static async listAll(page, pageSize, order, query) {
        return Personality.find(query)
          .skip(page * pageSize)
          .limit(pageSize)
          .sort({ createdAt: order })
          .lean();
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

    static count(query) {
        return Personality.countDocuments()
          .where(query);
    }
};
