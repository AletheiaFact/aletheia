import util from "../../lib/util";

import { ILogger } from "../../lib/loggerInterface";

const Personality = require("../model/personalityModel");
const ClaimReview = require("../model/claimReviewModel");
const WikidataResolver = require("../../lib/wikidataResolver");

/**
 * @class PersonalityRepository
 */
export default class PersonalityRepository {
    optionsToUpdate: Object;
    wikidata: typeof WikidataResolver;
    logger: ILogger;

    constructor(logger: any = {}) {
        this.logger = logger;
        this.wikidata = new WikidataResolver();
        this.optionsToUpdate = {
            new: true,
            upsert: true
        };
    }

    /**
     * https://medium.com/javascript-in-plain-english/javascript-merge-duplicate-objects-in-array-of-objects-9a76c3a1c35c
     * @param array
     * @param property
     */
    mergeObjectsInUnique<T>(array: T[], property: any): T[] {
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

    async listAll(
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
            const wbentities = await this.wikidata.queryWikibaseEntities(
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

    create(personality) {
        try {
            const newPersonality = new Personality(personality);
            this.logger.log(
                "info",
                `Attempting to create new personality with data ${personality}`
            );
            return newPersonality.save();
        } catch (err) {}
    }

    async getById(personalityId, language = "en") {
        const personality = await Personality.findById(personalityId).populate({
            path: "claims",
            select: "_id title content"
        });
        this.logger.log("info", `Found personality ${personality}`);
        return await this.postProcess(personality.toObject(), language);
    }

    private async postProcess(personality, language: string = "en") {
        if (personality) {
            // TODO: allow wikdiata resolver to fetch in batches
            const wikidataExtract = await this.wikidata.fetchProperties({
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

    async getReviewStats(id) {
        const personality = await Personality.findById(id);
        const reviews = await ClaimReview.aggregate([
            { $match: { personality: personality._id } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        this.logger.log("info", `Got stats ${reviews}`);
        return util.formatStats(reviews, true);
    }

    async update(personalityId, personalityBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const personality = await this.getById(personalityId);
            const newPersonality = Object.assign(personality, personalityBody);
            const personalityUpdate = await Personality.findByIdAndUpdate(
                personalityId,
                newPersonality,
                this.optionsToUpdate
            );
            this.logger.log(
                "info",
                `Updated personality with data ${newPersonality}`
            );
            return personalityUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(personalityId) {
        return Personality.findByIdAndRemove(personalityId);
    }

    count(query) {
        return Personality.countDocuments().where(query);
    }

    private extractClaimWithTextSummary(claims: any) {
        return claims.map(claim => {
            if (!claim.content) {
                return claim;
            }
            return { ...claim, content: claim.content.text };
        });
    }
}
