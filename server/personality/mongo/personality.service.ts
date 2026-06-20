import {
    Injectable,
    Inject,
    Logger,
    Scope,
    NotFoundException,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import slugify from "slugify";
import { Personality, PersonalityDocument } from "./schemas/personality.schema";
import { WikidataService } from "../../wikidata/wikidata.service";
import { UtilService } from "../../util";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { HistoryService } from "../../history/history.service";
import { HistoryType, TargetModel } from "../../history/schema/history.schema";
import {
    ISoftDeletedDocument,
    ISoftDeletedModel,
} from "mongoose-softdelete-typescript";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../../types";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import type {
    IFindAllOptions,
    IPersonality,
    IPersonalityCreateInput,
    IPersonalityFindAllResult,
    IPersonalityFindOrCreateInput,
    IPersonalityGetByIdOptions,
    IPersonalityListQuery,
    IPersonalityListResult,
    IPersonalityUpdateInput,
} from "../../interfaces/personality.interface";
import type { IPersonalityService } from "../../interfaces/personality.service.interface";
import { escapeRegex } from "../../util/regex.util";
import { toError } from "../../util/error-handling";

@Injectable({ scope: Scope.REQUEST })
export class MongoPersonalityService {
    private readonly logger = new Logger("PersonalityService");
    private readonly optionsToUpdate = {
        new: true,
        upsert: true,
    };

    constructor(
        @Inject(REQUEST) private readonly req: BaseRequest,
        @InjectModel(Personality.name)
        private readonly PersonalityModel: ISoftDeletedModel<PersonalityDocument> &
            Model<PersonalityDocument>,
        private readonly claimReview: ClaimReviewService,
        private readonly historyService: HistoryService,
        private readonly wikidata: WikidataService,
        private readonly util: UtilService
    ) {}

    private async getWikidataEntities(regex: string, language: string) {
        return await this.wikidata.queryWikibaseEntities(
            regex,
            language,
            false
        );
    }

    private async getWikidataList(regex: string, language: string) {
        const wbentities = await this.getWikidataEntities(regex, language);
        return wbentities.map((entity) => entity.wikidata);
    }

    async listAll(query: IPersonalityListQuery): Promise<IPersonality[]> {
        const {
            page = 0,
            pageSize = 10,
            order = "asc",
            language = "en",
            withSuggestions = false,
            filter,
        } = query;
        const mongoQuery = this.verifyInputsQuery(query);

        let personalities: any[];

        if (order === "random") {
            personalities = await this.PersonalityModel.aggregate([
                {
                    $match: {
                        $and: [mongoQuery, { _id: { $ne: filter } }],
                    },
                },
                { $sample: { size: pageSize } },
            ]);
        } else if (mongoQuery?.name) {
            const wikidataList = await this.getWikidataList(
                mongoQuery.name.$regex,
                language
            );
            personalities = await this.PersonalityModel.find({
                $or: [
                    { wikidata: { $in: wikidataList } },
                    { query: mongoQuery },
                ],
            })
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order as any })
                .lean();
        } else {
            personalities = await this.PersonalityModel.find(mongoQuery)
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order as any })
                .lean();
        }

        if (withSuggestions && mongoQuery?.name) {
            personalities = this.util.mergeObjectsInUnique(
                [
                    ...(await this.getWikidataEntities(
                        mongoQuery.name.$regex,
                        language
                    )),
                    ...personalities,
                ],
                "wikidata"
            );
        }

        const processedPersonalities = await Promise.all(
            personalities.map(async (personality: any) => {
                try {
                    return await this.postProcess(personality, language);
                } catch (error: any) {
                    this.logger.log(
                        `It was not possible to do postProcess the personality ${personality}`
                    );
                    return null;
                }
            })
        );

        return processedPersonalities.filter(
            (personalities: any) =>
                personalities !== null && personalities !== undefined
        );
    }

    async create(input: IPersonalityCreateInput): Promise<IPersonality> {
        const personality: IPersonalityCreateInput & { slug?: string } = {
            ...input,
            description: input.description ?? "",
        };
        try {
            const personalityExists = personality.wikidata
                ? await this.getDeletedPersonalityByWikidata(
                      personality.wikidata
                  )
                : null;

            if (personalityExists) {
                return (await personalityExists.restore()) as unknown as IPersonality;
            } else {
                personality.slug = slugify(personality.name, {
                    lower: true,
                    strict: true,
                });
                const newPersonality = new this.PersonalityModel(personality);
                this.logger.log(
                    `Attempting to create new personality with data ${personality}`
                );

                const user = this.req.user?._id;

                const history = this.historyService.getHistoryParams(
                    newPersonality._id,
                    TargetModel.Personality,
                    user,
                    HistoryType.Create,
                    personality
                );

                await this.historyService.createHistory(history as any);

                return newPersonality.save();
            }
        } catch (error) {
            const err = toError(error);
            this.logger.error(`Error creating personality: ${err.message}`);
            throw error;
        }
    }

    private getDeletedPersonalityByWikidata(
        wikidata: string
    ): Promise<(PersonalityDocument & ISoftDeletedDocument) | null> {
        return this.PersonalityModel.findOne({
            isDeleted: true,
            wikidata,
        }).exec() as Promise<
            (PersonalityDocument & ISoftDeletedDocument) | null
        >;
    }

    async findOrCreatePersonality(
        personalityData: IPersonalityFindOrCreateInput
    ): Promise<IPersonality> {
        const wikidataId = personalityData.wikidata?.id || null;

        if (wikidataId) {
            const existing = await this.PersonalityModel.findOne({
                wikidata: wikidataId,
                isDeleted: false,
            });
            if (existing) {
                this.logger.log(
                    `Found existing personality by wikidata: ${wikidataId}`
                );
                return existing;
            }
        }

        const slug = slugify(personalityData.name, {
            lower: true,
            strict: true,
        });

        const existingBySlug = await this.PersonalityModel.findOne({
            slug,
            isDeleted: false,
        });

        if (existingBySlug) {
            this.logger.log(`Found existing personality by slug: ${slug}`);
            if (wikidataId && !existingBySlug.wikidata) {
                existingBySlug.wikidata = wikidataId;
                await existingBySlug.save();
                this.logger.log(
                    `Updated personality ${slug} with wikidata: ${wikidataId}`
                );
            }
            return existingBySlug;
        }

        const newPersonality = new this.PersonalityModel({
            name: personalityData.name,
            slug,
            description:
                personalityData.wikidata?.description ||
                `Personality: ${personalityData.name}`,
            wikidata: wikidataId,
            isHidden: false,
        });

        await newPersonality.save();
        this.logger.log(`Created new personality: ${personalityData.name}`);

        return newPersonality;
    }

    async getById(
        personalityId: string,
        options: IPersonalityGetByIdOptions = {
            language: "en",
            nameSpace: NameSpaceEnum.Main,
        }
    ) {
        this.logger.debug(`Fetching personality with id: ${personalityId}`);

        const queryOptions = this.util.getParamsBasedOnUserRole(
            { _id: personalityId },
            this.req
        );

        const personality = await this.PersonalityModel.findOne(queryOptions)
            .populate({
                path: "claims",
                match: {
                    isHidden: false,
                    isDeleted: false,
                    nameSpace: options.nameSpace,
                },
                select: "_id title content",
            })
            .exec();

        if (!personality) {
            this.logger.warn(
                `Personality not found or filtered by access rules. ID: ${personalityId}`
            );
            return null;
        }

        let processed;

        try {
            processed = await this.postProcess(
                personality.toObject(),
                options.language
            );
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Post-processing failed for personality ${personalityId}`,
                err.stack
            );
            throw new InternalServerErrorException(
                "Failed to process personality data."
            );
        }

        if (!processed) {
            this.logger.warn(
                `Post-processing returned invalid result for personality ${personalityId}`
            );
            return null;
        }

        return processed;
    }

    async getPersonalityBySlug(
        query: { slug: string; isHidden?: boolean; isDeleted?: boolean },
        language = "pt"
    ) {
        const queryOptions = this.util.getParamsBasedOnUserRole(
            query,
            this.req
        );

        try {
            const personality = await this.PersonalityModel.findOne(
                queryOptions
            );
            if (!personality) {
                throw new NotFoundException();
            }
            const processed = await this.postProcess(
                personality.toObject(),
                language
            );

            if (!processed) {
                throw new NotFoundException(
                    `Personality not found or has invalid instance type`
                );
            }

            return processed;
        } catch {
            throw new NotFoundException();
        }
    }

    async getClaimsByPersonalitySlug(
        query: { slug: string; isDeleted?: boolean },
        language = "pt"
    ) {
        const queryOptions = this.util.getParamsBasedOnUserRole(
            query,
            this.req
        );

        const nameSpace = this.req.params.namespace || NameSpaceEnum.Main;
        const personality: any = await this.PersonalityModel.findOne(
            queryOptions
        ).populate({
            path: "claims",
            match: { isHidden: false, isDeleted: false, nameSpace },
            populate: {
                path: "latestRevision",
                select: "_id title content",
            },
            select: "_id",
        });

        if (!personality) {
            this.logger.warn(
                `Personality not found for slug "${query.slug}" in namespace "${nameSpace}"`
            );
            throw new NotFoundException(
                `Personality not found for slug "${query.slug}"`
            );
        }

        const claimsWithMissingRevisions = personality.claims.filter(
            (claim: any) => !claim.latestRevision
        );
        if (claimsWithMissingRevisions.length > 0) {
            const claimIds = claimsWithMissingRevisions.map((c: any) => c._id);
            const displayedIds = claimIds.slice(0, 10).join(", ");
            const remaining =
                claimIds.length > 10 ? ` and ${claimIds.length - 10} more` : "";
            this.logger.warn(
                `Personality "${query.slug}" has ${claimsWithMissingRevisions.length} claims with missing latestRevision. ` +
                    `Claim IDs: ${displayedIds}${remaining}`
            );
        }

        personality.claims = personality.claims
            .filter((claim: any) => claim.latestRevision)
            .map((claim: any) => ({
                ...claim.latestRevision,
                ...claim,
            }));

        this.logger.log(
            `Found personality "${query.slug}" (${personality._id}) with ${personality.claims.length} claims`
        );

        const processed = await this.postProcess(
            personality.toObject(),
            language
        );

        if (!processed) {
            this.logger.warn(
                `Personality "${query.slug}" (${personality._id}) filtered out during postProcess (invalid wikidata type)`
            );
            throw new NotFoundException(
                `Personality not found or has invalid instance type`
            );
        }

        return processed;
    }

    private async postProcess(personality: any, language: string = "en") {
        if (!personality) {
            return personality;
        }

        let wikidataExtract;
        try {
            wikidataExtract = await this.wikidata.fetchProperties({
                wikidataId: personality.wikidata,
                language,
            });
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Wikidata fetch failed for personality ${personality._id} ` +
                    `(wikidataId: ${personality.wikidata}): ${err.message}`
            );
            throw error;
        }

        if (wikidataExtract.isAllowedProp === false) {
            this.logger.warn(
                `Personality ${personality._id} filtered out: wikidata entity ${personality.wikidata} is not an allowed type`
            );
            return;
        }

        const definedWikidataFields = Object.fromEntries(
            Object.entries(wikidataExtract).filter(
                ([, value]) => value !== undefined
            )
        );

        return Object.assign(personality, definedWikidataFields, {
            stats:
                personality._id && (await this.getReviewStats(personality._id)),
            claims:
                personality.claims &&
                this.extractClaimWithTextSummary(personality.claims),
        });
    }

    async getReviewStats(_id: string) {
        const reviews = await this.claimReview.agreggateClassification({
            personality: _id,
            isDeleted: false,
            isPublished: true,
            isHidden: false,
            nameSpace:
                this.req.params.namespace ||
                this.req.query.nameSpace ||
                NameSpaceEnum.Main,
        });
        this.logger.log(`Got stats ${reviews}`);
        return this.util.formatStats(reviews);
    }

    async update(
        personalityId: string,
        newPersonalityBody: IPersonalityUpdateInput
    ): Promise<IPersonality | null> {
        const body: IPersonalityUpdateInput & { slug?: string } = {
            ...newPersonalityBody,
        };
        if (body.name) {
            body.slug = slugify(body.name, {
                lower: true,
                strict: true,
            });
        }
        const personality = await this.getById(personalityId);
        const previousPersonality = { ...personality };
        const newPersonality = Object.assign(personality ?? {}, body);
        const personalityUpdate = await this.PersonalityModel.findByIdAndUpdate(
            personalityId,
            newPersonality,
            this.optionsToUpdate
        );
        this.logger.log(`Updated personality with data ${newPersonality}`);

        const user = this.req.user?._id;

        const history = this.historyService.getHistoryParams(
            personalityId,
            TargetModel.Personality,
            user,
            HistoryType.Update,
            personalityUpdate,
            previousPersonality
        );
        await this.historyService.createHistory(history as any);

        return personalityUpdate;
    }

    async hideOrUnhidePersonality(
        personalityId: string,
        isHidden: boolean,
        description: string
    ): Promise<IPersonality> {
        const personality = await this.getById(personalityId);

        const newPersonality = {
            ...personality,
            isHidden,
        };

        const before = { isHidden: !isHidden };
        const after = isHidden ? { isHidden, description } : { isHidden };

        const history = this.historyService.getHistoryParams(
            newPersonality._id,
            TargetModel.Personality,
            this.req.user?._id,
            isHidden ? HistoryType.Hide : HistoryType.Unhide,
            after,
            before
        );
        await this.historyService.createHistory(history as any);

        const updated = await this.PersonalityModel.findByIdAndUpdate(
            { _id: personality._id },
            newPersonality
        ).exec();
        if (!updated) {
            throw new NotFoundException(
                `Personality not found: ${personality._id}`
            );
        }
        return updated;
    }

    async delete(personalityId: string): Promise<unknown> {
        const user = this.req.user?._id;
        this.logger.log(
            `Initiating soft delete for personalityId: ${personalityId} by user: ${user}`
        );

        try {
            const previousPersonality = await this.getById(personalityId);

            if (!previousPersonality) {
                this.logger.warn(
                    `Attempted to soft delete non-existent personalityId: ${personalityId}`
                );
                return null;
            }

            const history = this.historyService.getHistoryParams(
                personalityId,
                TargetModel.Personality,
                user,
                HistoryType.Delete,
                null,
                previousPersonality
            );
            await this.historyService.createHistory(history as any);

            const result = await this.PersonalityModel.softDelete({
                _id: personalityId,
            });
            this.logger.log(
                `Personality ${personalityId} successfully marked as isDeleted`
            );

            return result;
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Error during soft delete for personalityId: ${personalityId}. Details: ${err.message}`
            );
            throw error;
        }
    }

    // Exclude hidden personalities so the count stays cacheable.
    count(
        query: Partial<IPersonality> & { isDeleted?: boolean } = {}
    ): Promise<number> {
        return this.PersonalityModel.countDocuments()
            .where({
                ...query,
                isDeleted: false,
                isHidden: query.isHidden || false,
            })
            .exec();
    }

    private extractClaimWithTextSummary(claims: any) {
        claims = Array.isArray(claims) ? claims : [claims];
        return claims.map((claim: any) => {
            if (!claim.content) {
                return claim;
            }
            return { ...claim, content: claim.content.text };
        });
    }

    private verifyInputsQuery(query: Record<string, any>) {
        const queryInputs: any = {};
        if (query.name) {
            (queryInputs as Record<string, unknown>).name = {
                $regex: escapeRegex(query.name),
                $options: "i",
            };
        }
        queryInputs.isHidden = query?.isHidden || false;
        queryInputs.isDeleted = false;
        return queryInputs;
    }

    combinedListAll(
        query: IPersonalityListQuery
    ): Promise<IPersonalityListResult> {
        const { page = 0, pageSize = 10 } = query;
        const queryInputs = this.verifyInputsQuery(query);

        return Promise.all([this.listAll(query), this.count(queryInputs)])
            .then(([personalities, totalPersonalities]) => {
                const totalPages = Math.ceil(totalPersonalities / pageSize);

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
            .catch((error: any) => {
                this.logger.error(error);
                return error;
            });
    }

    async findAll({
        searchText,
        pageSize,
        language,
        skippedDocuments,
    }: IFindAllOptions): Promise<IPersonalityFindAllResult> {
        const personalities = await this.PersonalityModel.aggregate([
            {
                $search: {
                    index: "personality_fields",
                    text: {
                        query: searchText,
                        path: "name",
                        fuzzy: {
                            maxEdits: 1, // Using maxEdits: 1 to allow minor typos or spelling errors in search queries.
                        },
                    },
                },
            },
            { $match: { isHidden: false, isDeleted: false } },
            {
                $facet: {
                    rows: [
                        {
                            $skip: skippedDocuments || 0,
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

        const processedPersonalities = await Promise.all(
            personalities[0].rows.map(async (personality: any) => {
                try {
                    return await this.postProcess(personality, language);
                } catch (error: any) {
                    this.logger.log(
                        `It was not possible to do postProcess the personality ${personality._id}`
                    );
                    return null;
                }
            })
        );

        const filteredPersonalities = processedPersonalities.filter(
            (personality) => personality !== null && personality !== undefined
        );

        return {
            totalRows: filteredPersonalities.length,
            processedPersonalities: filteredPersonalities,
        };
    }
}

// Port conformance: fails build if MongoPersonalityService drifts from IPersonalityService.
const _assertImplementsPort: IPersonalityService =
    {} as MongoPersonalityService;
void _assertImplementsPort;
