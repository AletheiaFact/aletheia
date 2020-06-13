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
            select: "_id title content"
        });
        return await this.postProcess(personality.toObject(), language);
    }

    private static async postProcess(personality, language: string = "en") {
        if (personality) {
            // TODO: allow wikdiata resolver to fetch in batches
            const wikidataExtract = await wikidata.fetchProperties({
                wikidataId: personality.wikidata,
                language
            });
            return Object.assign(personality, {
                stats: await this.getReviewStats(personality._id),
                ...wikidataExtract,
                claims: this.extractClaimWithTextSummary(personality.claims)
            });
        }

        return personality;
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

    private static extractClaimWithTextSummary(claims: any) {
        return claims.map(claim => {
            return { ...claim, content: claim.content.text };
        });
    }
};
