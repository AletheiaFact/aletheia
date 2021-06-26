import { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Personality, PersonalityDocument } from "./schemas/personality.schema";
import { WikidataService } from "../wikidata/wikidata.service";
import { UtilService } from "../util";
import { ClaimReviewService } from "../claim-review/claim-review.service";

@Injectable()
export class PersonalityService {
    private readonly logger = new Logger("PersonalityService");
    private readonly optionsToUpdate = {
        new: true,
        upsert: true,
    };

    constructor(
        @InjectModel(Personality.name)
        private PersonalityModel: Model<PersonalityDocument>,
        private claimReview: ClaimReviewService,
        private wikidata: WikidataService,
        private util: UtilService
    ) {}

    async listAll(
        page,
        pageSize,
        order,
        query,
        language,
        withSuggestions = false
    ) {
        let personalities = await this.PersonalityModel.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
        if (withSuggestions) {
            const wbentities = await this.wikidata.queryWikibaseEntities(
                query.name.$regex,
                language
            );
            personalities = this.util.mergeObjectsInUnique(
                [...wbentities, ...personalities],
                "wikidata"
            );
        }
        return Promise.all(
            personalities.map(async (personality) => {
                return await this.postProcess(personality, language);
            })
        );
    }

    create(personality) {
        try {
            const newPersonality = new this.PersonalityModel(personality);
            this.logger.log(
                `Attempting to create new personality with data ${personality}`
            );
            return newPersonality.save();
        } catch (err) {}
    }

    async getById(personalityId, language = "en") {
        const personality = await this.PersonalityModel.findById(
            personalityId
        ).populate({
            path: "claims",
            select: "_id title content",
        });
        this.logger.log(`Found personality ${personality._id}`);
        return await this.postProcess(personality.toObject(), language);
    }

    async postProcess(personality, language: string = "en") {
        if (personality) {
            // TODO: allow wikdiata resolver to fetch in batches
            const wikidataExtract = await this.wikidata.fetchProperties({
                wikidataId: personality.wikidata,
                language,
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
                    this.extractClaimWithTextSummary(personality.claims),
            });
        }

        return personality;
    }

    async getReviewStats(id) {
        const personality = await this.PersonalityModel.findById(id);
        const reviews = await this.claimReview.agreggateClassification({
            personality: personality._id,
        });
        this.logger.log(`Got stats ${reviews}`);
        return this.util.formatStats(reviews, true);
    }

    async update(personalityId, personalityBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const personality = await this.getById(personalityId);
            const newPersonality = Object.assign(personality, personalityBody);
            const personalityUpdate =
                await this.PersonalityModel.findByIdAndUpdate(
                    personalityId,
                    newPersonality,
                    this.optionsToUpdate
                );
            this.logger.log(`Updated personality with data ${newPersonality}`);
            return personalityUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(personalityId) {
        return this.PersonalityModel.findByIdAndRemove(personalityId);
    }

    count(query) {
        return this.PersonalityModel.countDocuments().where(query);
    }

    extractClaimWithTextSummary(claims: any) {
        claims = Array.isArray(claims) ? claims : [claims];
        return claims.map((claim) => {
            if (!claim.content) {
                return claim;
            }
            return { ...claim, content: claim.content.text };
        });
    }
}
