'use strict';

const Personality = require('../model/personalityModel');
const ClaimReview = require('../model/claimReviewModel');

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

    static async getById(personalityId) {
        const personality = await Personality.findById(personalityId)
            .populate('claims', '_id title');
        if (personality) {
            const stats = await this.getReviewStats(personalityId);
            return Object.assign(personality.toObject(), { stats });
        }
        return personality;
    }

    static async getReviewStatsByClaims(id) {
        const personality =  await Personality.findById(id);
        return Promise.all(
            personality.claims.map(async(claimId) => {
                const reviews = await ClaimReview.aggregate([
                    { $match: { claim: claimId } },
                    { $group: { _id: "$classification", count: { $sum: 1 } } },
                ]);

                return { claimId, reviews };
            })
        ).then((result) => {
            return result;
        });
    }

    static async getReviewStats(id) {
        const personality =  await Personality.findById(id);
        const reviews = await ClaimReview.aggregate([
            { $match: { personality: personality._id } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
        ]);
        const total = reviews.reduce((agg, review) => {
            agg += review.count;
            return agg;
        }, 0);
        const result = reviews.map((review) => {
            const percentage = review.count / total * 100;
            return { _id: review._id, percentage };
        });
        return { total, reviews: result };
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
