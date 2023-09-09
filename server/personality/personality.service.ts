import {
    Injectable,
    Inject,
    Logger,
    Scope,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { Personality, PersonalityDocument } from "./schemas/personality.schema";
import { WikidataService } from "../wikidata/wikidata.service";
import { UtilService } from "../util";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import { REQUEST } from "@nestjs/core";
import { BaseRequest } from "../types";
import { Roles } from "../auth/ability/ability.factory";

export interface FindAllOptions {
    searchText: string;
    pageSize: number;
    language?: string;
    skipedDocuments?: number;
}

@Injectable({ scope: Scope.REQUEST })
export class PersonalityService {
    private readonly logger = new Logger("PersonalityService");
    private readonly optionsToUpdate = {
        new: true,
        upsert: true,
    };

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(Personality.name)
        private PersonalityModel: ISoftDeletedModel<PersonalityDocument> &
            Model<PersonalityDocument>,
        private claimReview: ClaimReviewService,
        private history: HistoryService,
        private wikidata: WikidataService,
        private util: UtilService,
        private historyService: HistoryService
    ) {}

    async getWikidataEntities(regex, language) {
        return await this.wikidata.queryWikibaseEntities(regex, language);
    }
    async getWikidataList(regex, language) {
        const wbentities = await this.getWikidataEntities(regex, language);
        return wbentities.map((entity) => entity.wikidata);
    }

    async listAll(
        page,
        pageSize,
        order,
        query,
        language,
        withSuggestions = false
    ) {
        let personalities;

        if (order === "random") {
            personalities = await this.PersonalityModel.aggregate([
                { $match: { ...query, isHidden: false, isDeleted: false } },
                { $sample: { size: pageSize } },
            ]);
        } else if (Object.keys(query).length > 0) {
            const wikidataList = await this.getWikidataList(
                query?.name.$regex,
                language
            );

            personalities = await this.PersonalityModel.find({
                $or: [
                    { wikidata: { $in: wikidataList } },
                    { ...query, isHidden: false, isDeleted: false },
                ],
            })
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order })
                .lean();
        } else {
            personalities = await this.PersonalityModel.find({
                ...query,
                isHidden: false,
                isDeleted: false,
            })
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order })
                .lean();
        }

        if (withSuggestions) {
            personalities = this.util.mergeObjectsInUnique(
                [
                    ...(await this.getWikidataEntities(
                        query?.name.$regex,
                        language
                    )),
                    ...personalities,
                ],
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
    async create(personality) {
        try {
            const personalityExists =
                await this.getDeletedPersonalityByWikidata(
                    personality.wikidata
                );

            if (personalityExists) {
                return personalityExists.restore();
            } else {
                personality.slug = slugify(personality.name, {
                    lower: true, // convert to lower case, defaults to `false`
                    strict: true, // strip special characters except replacement, defaults to `false`
                });
                const newPersonality = new this.PersonalityModel(personality);
                this.logger.log(
                    `Attempting to create new personality with data ${personality}`
                );

                const user = this.req.user;

                const history = this.history.getHistoryParams(
                    newPersonality._id,
                    TargetModel.Personality,
                    user,
                    HistoryType.Create,
                    personality
                );

                this.history.createHistory(history);

                return newPersonality.save();
            }
        } catch (err) {}
    }

    getDeletedPersonalityByWikidata(wikidata) {
        return this.PersonalityModel.findOne({
            isDeleted: true,
            wikidata,
        });
    }

    async getById(personalityId, language = "en") {
        const query = { _id: personalityId };
        const user = this.req.user;
        const isUserAdmin = user?.role === Roles.Admin;
        const queryOptions = isUserAdmin
            ? { ...query }
            : { ...query, isHidden: false };

        const personality = await this.PersonalityModel.findOne(
            queryOptions
        ).populate({
            path: "claims",
            select: "_id title content",
        });
        this.logger.log(`Found personality ${personality._id}`);
        return await this.postProcess(personality.toObject(), language);
    }

    async getPersonalityBySlug(query, language = "pt") {
        const user = this.req.user;
        const isUserAdmin = user?.role === Roles.Admin;
        const queryOptions = isUserAdmin
            ? { ...query }
            : { ...query, isHidden: false };

        try {
            const personality = await this.PersonalityModel.findOne(
                queryOptions
            );
            return await this.postProcess(personality.toObject(), language);
        } catch {
            throw new NotFoundException();
        }
    }

    async getClaimsByPersonalitySlug(query, language = "pt") {
        const user = this.req.user;
        const isUserAdmin = user?.role === Roles.Admin;
        const queryOptions = isUserAdmin
            ? { ...query }
            : { ...query, isHidden: false };

        try {
            // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
            const personality: any = await this.PersonalityModel.findOne(
                queryOptions
            ).populate({
                path: "claims",
                populate: {
                    path: "latestRevision",
                    select: "_id title content",
                },
                select: "_id",
            });
            personality.claims = await Promise.all(
                personality.claims.map((claim) => {
                    return {
                        ...claim.lastestRevision,
                        ...claim,
                    };
                })
            );
            this.logger.log(`Found personality ${personality._id}`);
            return await this.postProcess(personality.toObject(), language);
        } catch {
            throw new NotFoundException();
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
            //The order of wikidataExtract should be after personality
            return Object.assign(personality, wikidataExtract, {
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
            isPublished: true,
            isHidden: false,
        });
        this.logger.log(`Got stats ${reviews}`);
        return this.util.formatStats(reviews);
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
        if (newPersonalityBody.name) {
            newPersonalityBody.slug = slugify(newPersonalityBody.name, {
                lower: true,
                strict: true,
            });
        }
        const personality = await this.getById(personalityId);
        const previousPersonality = { ...personality };
        const newPersonality = Object.assign(personality, newPersonalityBody);
        const personalityUpdate = await this.PersonalityModel.findByIdAndUpdate(
            personalityId,
            newPersonality,
            this.optionsToUpdate
        );
        this.logger.log(`Updated personality with data ${newPersonality}`);

        const user = this.req.user;

        const history = this.history.getHistoryParams(
            personalityId,
            TargetModel.Personality,
            user,
            HistoryType.Update,
            personalityUpdate,
            previousPersonality
        );
        await this.history.createHistory(history);

        return personalityUpdate;
    }

    async hideOrUnhidePersonality(personalityId, hide, description) {
        const personality = await this.getById(personalityId);

        const newPersonality = {
            ...personality,
            ...{
                isHidden: hide,
                description: hide ? description : undefined,
            },
        };

        const before = { isHidden: !hide };
        const after = hide
            ? { isHidden: hide, description }
            : { isHidden: hide };

        const history = this.historyService.getHistoryParams(
            newPersonality._id,
            TargetModel.Personality,
            this.req?.user,
            hide ? HistoryType.Hide : HistoryType.Unhide,
            after,
            before
        );
        this.historyService.createHistory(history);

        return this.PersonalityModel.updateOne(
            { _id: personality._id },
            newPersonality
        );
    }

    async getDescriptionForHide(personality) {
        if (personality?.isHidden) {
            const history = await this.historyService.getByTargetIdModelAndType(
                personality._id,
                TargetModel.Personality,
                0,
                1,
                "desc",
                HistoryType.Hide
            );

            return history[0]?.details?.after?.description;
        }

        return "";
    }

    /**
     * This function does a soft deletion, doesn't delete claim in DataBase,
     * but omit its in the front page
     * Also creates a History Module that tracks deletion of personalities.
     * @param personalityId Personality Id which wants to delete
     * @returns Returns the personality with the param isDeleted equal to true
     */
    async delete(personalityId) {
        const user = this.req.user;
        const previousPersonality = await this.getById(personalityId);
        const history = this.history.getHistoryParams(
            personalityId,
            TargetModel.Personality,
            user,
            HistoryType.Delete,
            null,
            previousPersonality
        );
        await this.history.createHistory(history);
        return this.PersonalityModel.softDelete({ _id: personalityId });
    }

    /**
     * Don't count hide personalities because of cache
     */
    count(query: any = {}) {
        return this.PersonalityModel.countDocuments().where({
            ...query,
            isDeleted: false,
            isHidden: false,
        });
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

    combinedListAll(query): any {
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

    async findAll({
        searchText,
        pageSize,
        language,
        skipedDocuments,
    }: FindAllOptions) {
        const personalities = await this.PersonalityModel.aggregate([
            {
                $search: {
                    index: "personality_fields",
                    text: {
                        query: searchText,
                        path: "name",
                        fuzzy: {
                            maxEdits: 2,
                        },
                    },
                },
            },
            { $match: { isHidden: false, isDeleted: false } },
            {
                $facet: {
                    rows: [
                        {
                            $skip: skipedDocuments || 0,
                        },
                        {
                            $limit: pageSize,
                        },
                    ],
                    totalRows: [
                        {
                            $count: "totalRows",
                        },
                    ],
                },
            },
            {
                $set: {
                    totalRows: {
                        $arrayElemAt: ["$totalRows.totalRows", 0],
                    },
                },
            },
        ]);

        return {
            totalRows: personalities[0].totalRows,
            processedPersonalities: await Promise.all(
                personalities[0].rows.map(async (personality) => {
                    return await this.postProcess(personality, language);
                })
            ),
        };
    }
}
