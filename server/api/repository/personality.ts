import util from "../../lib/util";
const Personality = require("../model/personalityModel");

const ClaimReview = require("../model/claimReviewModel");
const WikidataResolver = require("../../lib/wikidataResolver");

const optionsToUpdate = {
    new: true,
    upsert: true
};

const wikidata = new WikidataResolver();

/**
 * @class PersonalityRepository
 */
module.exports = class PersonalityRepository {
    static async listAll(page, pageSize, order, query, language) {
        return Personality.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean()
            .then(async personalities => {
                return Promise.all(
                    personalities.map(async personality => {
                        return await this.postProcess(personality, language);
                    })
                );
            });
    }

    static create(personality) {
        const newPersonality = new Personality(personality);
        return newPersonality.save();
    }

    static async getById(personalityId, language = "en") {
        const personality = await Personality.findById(personalityId).populate({
            path: "claims",
            select: "_id title"
        });
        return await this.postProcess(personality.toObject(), language);
    }

    private static async postProcess(personality, language: string = "en") {
        if (personality) {
            const stats = await this.getReviewStats(personality._id);
            const wikidataId = personality.wikidata;
            // TODO: allow wikdiata resolver to fetch in batches
            const wikidataExtract = await wikidata.fetchProperties({
                wikidataId,
                language
            });
            return Object.assign(personality, { stats }, wikidataExtract);
        }

        return personality;
    }

    static async getReviewStatsByClaims(id) {
        const personality = await Personality.findById(id);
        return Promise.all(
            personality.claims.map(async claimId => {
                const reviews = await ClaimReview.aggregate([
                    { $match: { claim: claimId } },
                    { $group: { _id: "$classification", count: { $sum: 1 } } }
                ]);

                return { claimId, reviews };
            })
        ).then(result => {
            return result;
        });
    }

    static async getReviewStats(id) {
        const personality = await Personality.findById(id);
        const reviews = await ClaimReview.aggregate([
            { $match: { personality: personality._id } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        return util.formatStats(reviews, true);
    }

    static async update(personalityId, personalityBody) {
        // eslint-disable-next-line no-useless-catch
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
            // TODO: log to service-runner
            throw error;
        }
    }

    static delete(personalityId) {
        return Personality.findByIdAndRemove(personalityId);
    }

    static count(query) {
        return Personality.countDocuments().where(query);
    }
};
