import {
    Injectable,
    Inject,
    Logger,
    Scope,
    NotFoundException,
    InternalServerErrorException,
    ServiceUnavailableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    defaultDescription,
    deriveSlug,
    extractClaimWithTextSummary,
    wikidataCreationError,
    WikidataCreationStatus,
} from "../shared/personality.rules";
import { Personality, PersonalityDocument } from "./schemas/personality.schema";
import { WikidataService } from "../../wikidata/wikidata.service";
import { UtilService } from "../../util";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import { HistoryService } from "../../history/history.service";
import { HistoryType, TargetModel } from "../../history/schema/history.schema";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../../types";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import {
    ICombinedListResult,
    IFindAllOptions,
    IFindAllResult,
} from "../../interfaces/personality.interface";
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

    /** The active personality that holds a Wikidata id, if any. */
    protected findActiveByWikidata(wikidataId: string) {
        return this.PersonalityModel.findOne({
            wikidata: wikidataId,
            isDeleted: false,
        });
    }

    /**
     * Checks that a Wikidata item can back a personality and returns its
     * data. Throws 400 (deleted / not an allowed type), 409 (used by another
     * active personality) or 503 (Wikidata unavailable: never create
     * unchecked). The check bypasses the cache so a stale entry cannot let a
     * deleted item through.
     */
    private async loadCreatableItem(
        wikidataId: string,
        excludePersonalityId?: string
    ) {
        let checked;
        try {
            checked = await this.wikidata.checkItem(wikidataId, "pt", {
                fresh: true,
            });
        } catch (error) {
            this.logger.error(
                `Wikidata check failed for ${wikidataId}: ${
                    toError(error).message
                }`
            );
            throw new ServiceUnavailableException(
                "Wikidata is unavailable, try again later"
            );
        }
        let status: WikidataCreationStatus = checked.status;
        if (status === "ok") {
            const inUse = await this.findActiveByWikidata(wikidataId);
            if (inUse && String(inUse._id) !== excludePersonalityId) {
                status = "in_use";
            }
        }
        const error = wikidataCreationError(status);
        if (error) throw error;
        return checked.props;
    }

    async getWikidataEntities(regex: string, language: string) {
        return await this.wikidata.queryWikibaseEntities(
            regex,
            language,
            false
        );
    }
    async getWikidataList(regex: string, language: string) {
        const wbentities = await this.getWikidataEntities(regex, language);
        return wbentities.map((entity) => entity.wikidata);
    }

    async listAll(
        page: number,
        pageSize: number,
        order: string,
        query: any,
        filter: any,
        language: string,
        withSuggestions = false
    ) {
        let personalities;

        if (order === "random") {
            personalities = await this.PersonalityModel.aggregate([
                {
                    $match: {
                        $and: [query, { _id: { $ne: filter } }],
                    },
                },
                { $sample: { size: pageSize } },
            ]);
        } else if (Object.keys(query).length > 0 && query?.name) {
            const wikidataList = await this.getWikidataList(
                query?.name.$regex,
                language
            );
            personalities = await this.PersonalityModel.find({
                $or: [{ wikidata: { $in: wikidataList } }, { query }],
            })
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order as any })
                .lean();
        } else {
            personalities = await this.PersonalityModel.find(query)
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order as any })
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

    /**
     * Creates a personality from a Wikidata item. Name and description come
     * from Wikidata, never from the client. A soft-deleted personality with
     * the same item is restored instead.
     */
    async create({ wikidata }: { wikidata: string }) {
        const deleted = await this.getDeletedPersonalityByWikidata(wikidata);
        if (deleted) {
            return deleted.restore();
        }

        const props = await this.loadCreatableItem(wikidata);
        const name = props.name as string;
        const newPersonality = new this.PersonalityModel({
            name,
            slug: deriveSlug(name),
            description: defaultDescription(name, props.description),
            wikidata,
            isHidden: false,
        });

        const history = this.historyService.getHistoryParams(
            newPersonality._id,
            TargetModel.Personality,
            this.req.user?._id,
            HistoryType.Create,
            { name, wikidata }
        );
        await this.historyService.createHistory(history as any);

        return newPersonality.save();
    }

    getDeletedPersonalityByWikidata(wikidata: string) {
        return this.PersonalityModel.findOne({
            isDeleted: true,
            wikidata,
        });
    }

    /**
     * Finds or creates a personality for an AI identification result.
     * Returns null, and creates nothing, when the AI gives no Wikidata id,
     * or the item is deleted, of another type, used elsewhere, or Wikidata is
     * unavailable. The caller records the name as unmatched.
     */
    async findOrCreatePersonality(personalityData: {
        name: string;
        wikidata?: {
            id?: string;
            label?: string;
            description?: string;
        };
    }): Promise<PersonalityDocument | null> {
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

        const slug = deriveSlug(personalityData.name);

        const existingBySlug = await this.PersonalityModel.findOne({
            slug,
            isDeleted: false,
        });

        if (existingBySlug) {
            this.logger.log(`Found existing personality by slug: ${slug}`);
            if (wikidataId && !existingBySlug.wikidata) {
                const usable = await this.loadCreatableItem(wikidataId).then(
                    () => true,
                    () => false
                );
                if (usable) {
                    existingBySlug.wikidata = wikidataId;
                    await existingBySlug.save();
                    this.logger.log(
                        `Updated personality ${slug} with wikidata: ${wikidataId}`
                    );
                }
            }
            return existingBySlug;
        }

        if (!wikidataId) return null;
        try {
            return (await this.create({
                wikidata: wikidataId,
            })) as unknown as PersonalityDocument;
        } catch (error) {
            this.logger.warn(
                `Not creating personality "${
                    personalityData.name
                }" (${wikidataId}): ${toError(error).message}`
            );
            return null;
        }
    }

    async getById(
        personalityId: string,
        query: { language?: string; nameSpace?: string } = {
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
                    nameSpace: query.nameSpace,
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
                query.language
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

    async getPersonalityBySlug(query: Record<string, any>, language = "pt") {
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
        query: Record<string, any>,
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

    async postProcess(personality: any, language: string = "en") {
        if (!personality) {
            return personality;
        }

        // Wikidata only adds data (label, image, wikipedia link) to a
        // personality. A personality that is already in our database stays
        // visible when its Wikidata item is deleted, changes type, or when
        // Wikidata is down: it keeps the name and description we store.
        // The type check only filters search suggestions (no `_id`), which
        // are Wikidata entities that are not personalities yet.
        const isSuggestion = !personality._id;
        let definedWikidataFields: Record<string, unknown> = {};

        if (personality.wikidata) {
            try {
                const wikidataExtract = await this.wikidata.fetchProperties({
                    wikidataId: personality.wikidata,
                    language,
                });

                if (wikidataExtract.isAllowedProp === false) {
                    if (isSuggestion) {
                        return;
                    }
                    this.logger.warn(
                        `Personality ${personality._id}: wikidata entity ${personality.wikidata} is not an allowed type; showing it without Wikidata data`
                    );
                } else {
                    definedWikidataFields = Object.fromEntries(
                        Object.entries(wikidataExtract).filter(
                            ([, value]) => value !== undefined
                        )
                    );
                }
            } catch (error) {
                const err = toError(error);
                this.logger.error(
                    `Wikidata fetch failed for personality ${personality._id} ` +
                        `(wikidataId: ${personality.wikidata}): ${err.message}`
                );
                if (isSuggestion) {
                    return;
                }
            }
        }

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

    /**
     * Admin edit of the stored fields. Writes onto the stored document, never
     * the Wikidata-merged copy, and never changes the slug (links to the
     * personality, its claims and reports keep working). A new Wikidata id
     * must pass the creation rule; both cache entries are cleared so the page
     * shows the new item at once.
     */
    async update(
        personalityId: string,
        body: { name?: string; description?: string; wikidata?: string }
    ) {
        const stored: any = await this.PersonalityModel.findOne({
            _id: personalityId,
            isDeleted: false,
        }).lean();
        if (!stored) {
            throw new NotFoundException(
                `Personality not found: ${personalityId}`
            );
        }

        const changes: Record<string, string> = {};
        for (const key of ["name", "description", "wikidata"] as const) {
            if (body[key] !== undefined && body[key] !== stored[key]) {
                changes[key] = body[key] as string;
            }
        }

        if (changes.wikidata) {
            await this.loadCreatableItem(changes.wikidata, String(stored._id));
        }

        const updated: any = await this.PersonalityModel.findOneAndUpdate(
            { _id: personalityId, isDeleted: false },
            { $set: changes },
            { new: true }
        ).lean();

        if (changes.wikidata) {
            if (stored.wikidata) {
                await this.wikidata.clearCache(stored.wikidata);
            }
            await this.wikidata.clearCache(changes.wikidata);
        }

        const before = Object.fromEntries(
            Object.keys(changes).map((key) => [key, stored[key]])
        );
        const history = this.historyService.getHistoryParams(
            personalityId,
            TargetModel.Personality,
            this.req.user?._id,
            HistoryType.Update,
            changes,
            before
        );
        await this.historyService.createHistory(history as any);

        return this.postProcess(updated, this.req.language || "pt");
    }

    /**
     * Stored fields for the admin edit form, with what Wikidata currently
     * provides, so the form never shows the Wikidata-merged values.
     */
    async getStored(personalityId: string) {
        const stored: any = await this.PersonalityModel.findOne({
            _id: personalityId,
            isDeleted: false,
        }).lean();
        if (!stored) {
            throw new NotFoundException(
                `Personality not found: ${personalityId}`
            );
        }

        let wikidataStatus:
            | "ok"
            | "deleted"
            | "not_allowed_type"
            | "unavailable"
            | "none" = "none";
        let props: { name?: string; description?: string } = {};
        if (stored.wikidata) {
            try {
                const checked = await this.wikidata.checkItem(
                    stored.wikidata,
                    "pt"
                );
                wikidataStatus = checked.status;
                props = checked.props;
            } catch {
                wikidataStatus = "unavailable";
            }
        }
        const provides = wikidataStatus === "ok";

        return {
            _id: String(stored._id),
            name: stored.name,
            description: stored.description,
            wikidata: stored.wikidata ?? null,
            wikidataStatus,
            wikidataProvides: {
                name: provides && !!props.name,
                description: provides && !!props.description,
            },
        };
    }

    async hideOrUnhidePersonality(
        personalityId: string,
        isHidden: boolean,
        description: string
    ): Promise<PersonalityDocument> {
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

    /**
     * Executes a soft delete on a specific personality record.
     * Records the action in the history module for auditing.
     * * @param {string} personalityId - The ID of the personality to mark as deleted.
     * @returns {Promise<Personality>} The personality document with isDeleted set to true, or null if not found.
     */
    async delete(personalityId: string) {
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

    /**
     * Don't count hide personalities because of cache
     */
    count(query: any = {}) {
        return this.PersonalityModel.countDocuments().where({
            ...query,
            isDeleted: false,
            isHidden: query.isHidden || false,
        });
    }

    extractClaimWithTextSummary(claims: any) {
        return extractClaimWithTextSummary(claims);
    }

    verifyInputsQuery(query: Record<string, any>) {
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

    combinedListAll(query: Record<string, any>): Promise<ICombinedListResult> {
        const { page = 0, pageSize = 10, order = "asc" } = query;
        const queryInputs = this.verifyInputsQuery(query);

        return Promise.all([
            this.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs,
                query.filter,
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
    }: IFindAllOptions): Promise<IFindAllResult> {
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
