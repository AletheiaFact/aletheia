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
    /**
     * https://medium.com/javascript-in-plain-english/javascript-merge-duplicate-objects-in-array-of-objects-9a76c3a1c35c
     * @param array
     * @param property
     */
    static mergeObjectsInUnique<T>(array: T[], property: any): T[] {
        const newArray = new Map();

        array.forEach((item: T) => {
            const propertyValue = item[property];
            newArray.has(propertyValue)
                ? newArray.set(propertyValue, {
                      ...item,
                      ...newArray.get(propertyValue)
                  })
                : newArray.set(propertyValue, item);
        });

        return Array.from(newArray.values());
    }

    static async listAll(
        page,
        pageSize,
        order,
        query,
        language,
        withSuggestions = false
    ) {
        let personalities = await Personality.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean();
        if (withSuggestions) {
            const wbentities = await wikidata.queryWikibaseEntities(
                query.name.$regex,
                language
            );
            personalities = this.mergeObjectsInUnique(
                [...wbentities, ...personalities],
                "wikidata"
            );
        }
        return Promise.all(
            personalities.map(async personality => {
                return await this.postProcess(personality, language);
            })
        );
    }

    static create(personality) {
        try {
            const newPersonality = new Personality(personality);
            return newPersonality.save();
        } catch (err) {}
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

            // bail out if wikidata property is not allowed
            if (wikidataExtract.isAllowedProp === false) {
                return;
            }
            return Object.assign(personality, {
                stats:
                    personality._id &&
                    (await this.getReviewStats(personality._id)),
                ...wikidataExtract,
                claims:
                    personality.claims &&
                    this.extractClaimWithTextSummary(personality.claims)
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
            if (!claim.content) {
                return claim;
            }
            return { ...claim, content: claim.content.text };
        });
    }
};
