'use strict';

const Personality = require('../model/personalityModel');

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

    static update(personalityId, personalityBody) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getById(personalityId)
            ])
            .then((personality) => {
                const newPersonality = Object.assign(personality, personalityBody);
                resolve(
                    Personality.findByIdAndUpdate(personalityId, newPersonality, { new: true })
                );
            })
            .catch((error) => {
                throw new Error(error);
            });
        });
    }

    static delete(personalityId) {
        return Personality.findByIdAndRemove(personalityId);
    }
};
