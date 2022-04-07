import { Injectable, Inject, Logger, Scope, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from 'slugify'
import { Personality, PersonalityDocument } from "./schemas/personality.schema";
import { WikidataService } from "../wikidata/wikidata.service";
import { UtilService } from "../util";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { ISoftDeletedModel } from 'mongoose-softdelete-typescript';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class PersonalityService {
    private readonly logger = new Logger("PersonalityService");
    private readonly optionsToUpdate = {
        new: true,
        upsert: true,
    };

    constructor(
        @Inject(REQUEST) private req: Request,
        @InjectModel(Personality.name)
        private PersonalityModel: ISoftDeletedModel<PersonalityDocument> & Model<PersonalityDocument>,
        private claimReview: ClaimReviewService,
        private history: HistoryService,
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
        let personalities;

        if (order === 'random') {
            // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
            personalities = await this.PersonalityModel.aggregate([
                { $match: query },
                { $sample: { size: pageSize } },
            ])

            
        } else {
            // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
            personalities = await this.PersonalityModel.find(query)
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order })
                .lean()
        }

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

    /**
     * This function will create a new personality and save it to the dataBase.
     * Also creates a History Module that tracks creation of personalities.
     * @param personality PersonalityBody received of the client.
     * @returns Return a new personality.
     */
    create(personality) {
        try {
            personality.slug = slugify(personality.name, {
                lower: true,     // convert to lower case, defaults to `false`
                strict: true     // strip special characters except replacement, defaults to `false`
            })
            const newPersonality = new this.PersonalityModel(personality);
            this.logger.log(
                `Attempting to create new personality with data ${personality}`
            );

            const user = this.req.user

            const history = this.history.getHistoryParams(
                newPersonality._id,
                TargetModel.Personality,
                user,
                HistoryType.Create,
                personality
            )

            this.history.createHistory(history)

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

    async getBySlug(personalitySlug, language = "en") {
        try {
             // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
            const personality: any = await this.PersonalityModel.findOne({
                slug: personalitySlug
            }).populate({
                path: "claims",
                populate: {
                    path: "latestRevision",
                    select: "_id title content"
                },
                select: "_id",
            });
            personality.claims = await Promise.all(personality.claims.map((claim) => {
                return {
                    ...claim.lastestRevision,
                    ...claim
                }
            })) 
            this.logger.log(`Found personality ${personality._id}`);
            return await this.postProcess(personality.toObject(), language);
        } catch {
            throw new NotFoundException()
        }
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
            return Object.assign(
                wikidataExtract,
                personality, {
                stats:
                    personality._id &&
                    (await this.getReviewStats(personality._id)),
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
            isDeleted: false,
        });
        this.logger.log(`Got stats ${reviews}`);
        return this.util.formatStats(reviews, true);
    }

    /**
     * This function overwrites personality data with the new data,
     * keeping data that has not changed.
     * Also creates a History Module that tracks updation of personalities.
     * @param personalityId Personality id which wants updated.
     * @param newPersonalityBody PersonalityBody received of the client.
     * @returns Return changed personality.
     */
    async update(personalityId, newPersonalityBody) {
        // eslint-disable-next-line no-useless-catch
        if(newPersonalityBody.name) {
            newPersonalityBody.slug = slugify(newPersonalityBody.name, {
                lower: true,
                strict: true
            })
        }
        const personality = await this.getById(personalityId);
        const previousPersonality = {...personality}
        const newPersonality = Object.assign(personality, newPersonalityBody);
        const personalityUpdate =
            await this.PersonalityModel.findByIdAndUpdate(
                personalityId,
                newPersonality,
                this.optionsToUpdate
            );
        this.logger.log(`Updated personality with data ${newPersonality}`);

        const user = this.req.user;

        const history =
            this.history.getHistoryParams(
                personalityId,
                TargetModel.Personality,
                user,
                HistoryType.Update,
                personalityUpdate,
                previousPersonality
            )
        await this.history.createHistory(history)
        
        return personalityUpdate;
    }

    /**
     * This function does a soft deletion, doesn't delete claim in DataBase,
     * but omit its in the front page
     * Also creates a History Module that tracks deletion of personalities.
     * @param personalityId Personality Id which wants to delete
     * @returns Returns the personality with the param isDeleted equal to true
     */
    async delete(personalityId) {
        const user = this.req.user
        const previousPersonality = await this.getById(personalityId)
        const history = this.history.getHistoryParams(
            personalityId,
            TargetModel.Personality,
            user,
            HistoryType.Delete,
            null,
            previousPersonality
        )
        await this.history.createHistory(history)
        return this.PersonalityModel.softDelete({ _id: personalityId });
    }

    count(query: any = {}) {
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

    verifyInputsQuery(query) {
        const queryInputs = {};
        if (query.name) {
            // @ts-ignore
            queryInputs.name = { $regex: query.name, $options: "i" };
        }
        return queryInputs;
    }

    combinedListAll(query) : any {
        const { page = 0, pageSize = 10, order = "asc" } = query;
        const queryInputs = this.verifyInputsQuery(query);

        return Promise.all([
            this.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs,
                query.language,
                query.withSuggestions
            ),
            this.count(queryInputs),
        ])
            .then(([personalities, totalPersonalities]) => {
                const totalPages = Math.ceil(
                    totalPersonalities / parseInt(pageSize, 10)
                );

                this.logger.log(
                    `Found ${totalPersonalities} personalities. Page ${page} of ${totalPages}`
                );

                return {
                    personalities,
                    totalPersonalities,
                    totalPages,
                    page,
                    pageSize,
                };
            })
            .catch((error) => this.logger.error(error));
    }
}
