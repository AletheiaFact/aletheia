import {
    Injectable,
    Inject,
    Scope,
    NotFoundException,
    Logger,
    InternalServerErrorException,
    ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
    FilterQuery,
    Model,
    PipelineStage,
    Types,
    UpdateWriteOpResult,
} from "mongoose";
import { Claim, ClaimDocument } from "./schemas/claim.schema";
import { ClaimReviewService } from "../../claim-review/claim-review.service";
import type { IClaimRevisionService } from "../../interfaces/claim-revision.service.interface";
import { HistoryService } from "../../history/history.service";
import { StateEventService } from "../../state-event/state-event.service";
import { HistoryType, TargetModel } from "../../history/schema/history.schema";
import { TypeModel } from "../../state-event/schema/state-event.schema";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../../types";
import { ReviewTaskService } from "../../review-task/review-task.service";
import { UtilService } from "../../util";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import type { IGroupService } from "../../interfaces/group.service.interface";
import type {
    ClaimListFilters,
    IClaimService,
} from "../../interfaces/claim.service.interface";
import { accentInsensitiveRegex } from "../../util/regex.util";
import { mapAggregateToRecord } from "../../util/mongo-utils";
import {
    annotateClaimContent,
    calculateOverallStats,
    deriveClaimSlug,
    getClaimContent,
} from "../shared/claim.rules";
import { toError } from "../../util/error-handling";

function buildDateRange(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) {
        return undefined;
    }
    return {
        ...(startDate ? { $gte: new Date(startDate) } : {}),
        ...(endDate ? { $lte: new Date(endDate) } : {}),
    };
}

// Whether any sentence/image of the claim's revisions (`revisionIds`)
// matches; capped at one hit since only existence is checked.
function lookupRevisionContent(
    from: "sentences" | "images",
    match: Record<string, unknown>,
    as: string
): PipelineStage.Lookup {
    return {
        $lookup: {
            from,
            localField: "revisionIds._id",
            foreignField: "claimRevisionId",
            pipeline: [
                { $match: { ...match, isDraft: { $ne: true } } },
                { $limit: 1 },
                { $project: { _id: 1 } },
            ],
            as,
        },
    };
}

type ClaimMatchParameters = (
    | { _id: string; isHidden?: boolean; nameSpace?: string }
    | {
          personalities: string;
          slug: string;
          isHidden?: boolean;
          nameSpace?: string;
      }
) &
    FilterQuery<ClaimDocument>;

@Injectable({ scope: Scope.REQUEST })
export class MongoClaimService implements IClaimService {
    private readonly logger = new Logger(MongoClaimService.name);

    constructor(
        @Inject(REQUEST) private readonly req: BaseRequest,
        @InjectModel(Claim.name)
        private readonly ClaimModel: ISoftDeletedModel<ClaimDocument> &
            Model<ClaimDocument>,
        private readonly claimReviewService: ClaimReviewService,
        private readonly historyService: HistoryService,
        private readonly stateEventService: StateEventService,
        @Inject("ClaimRevisionService")
        private readonly claimRevisionService: IClaimRevisionService,
        private readonly reviewTaskService: ReviewTaskService,
        private readonly util: UtilService,
        @Inject("GroupService") private readonly groupService: IGroupService
    ) {}

    async listAll(
        page: number,
        pageSize: number,
        order: string,
        query: FilterQuery<ClaimDocument>,
        filters?: ClaimListFilters
    ) {
        if (!query.isHidden && query.personalities) {
            // Modify query.personalities only if isHidden is false
            query.personalities = new Types.ObjectId(query.personalities);
        }

        if (filters) {
            return this.listFiltered(page, pageSize, order, query, filters);
        }

        const [claims, total] = await Promise.all([
            this.ClaimModel.find(query)
                .populate("latestRevision")
                .skip(page * pageSize)
                .limit(pageSize)
                .sort({ _id: order as "asc" | "desc" })
                .lean(),

            this.ClaimModel.countDocuments(query),
        ]);

        const processedClaim = await Promise.all(
            claims.map((claim: any) => {
                return this.postProcess({
                    ...claim.latestRevision,
                    ...claim,
                });
            })
        );

        return {
            data: processedClaim,
            total,
        };
    }

    /**
     * Repository listing: the aggregation filters on the latest revision and
     * the claim's sentences/images, then the page is loaded with the regular
     * populate so postProcess sees the same shape as the find path.
     */
    private async listFiltered(
        page: number,
        pageSize: number,
        order: string,
        query: FilterQuery<ClaimDocument>,
        filters: ClaimListFilters
    ) {
        const direction: 1 | -1 = order === "asc" ? 1 : -1;
        const sort: Record<string, 1 | -1> =
            filters.sortBy === "date"
                ? { "latestRevision.date": direction, _id: direction }
                : { _id: direction };

        const pipeline: PipelineStage[] = [
            { $match: { isDeleted: false, ...query } },
            {
                $lookup: {
                    from: "claimrevisions",
                    localField: "latestRevision",
                    foreignField: "_id",
                    pipeline: [
                        { $project: { title: 1, date: 1, contentModel: 1 } },
                    ],
                    as: "latestRevision",
                },
            },
            { $unwind: "$latestRevision" },
        ];

        const dateRange = buildDateRange(filters.startDate, filters.endDate);
        if (dateRange) {
            pipeline.push({ $match: { "latestRevision.date": dateRange } });
        }

        if (filters.q || filters.topic) {
            // Sentences and images point at the revision that created them,
            // which may be older than the latest one, so match on all of them.
            pipeline.push({
                $lookup: {
                    from: "claimrevisions",
                    localField: "_id",
                    foreignField: "claimId",
                    pipeline: [{ $project: { _id: 1 } }],
                    as: "revisionIds",
                },
            });
        }

        if (filters.q) {
            const text = {
                $regex: accentInsensitiveRegex(filters.q),
                $options: "i",
            };
            pipeline.push(
                lookupRevisionContent("sentences", { content: text }, "textHits"),
                {
                    $match: {
                        $or: [
                            { "latestRevision.title": text },
                            { "textHits.0": { $exists: true } },
                        ],
                    },
                }
            );
        }

        if (filters.topic) {
            const topic = { "topics.id": new Types.ObjectId(filters.topic) };
            pipeline.push(
                lookupRevisionContent("sentences", topic, "topicSentences"),
                lookupRevisionContent("images", topic, "topicImages"),
                {
                    $match: {
                        $or: [
                            { "topicSentences.0": { $exists: true } },
                            { "topicImages.0": { $exists: true } },
                        ],
                    },
                }
            );
        }

        if (filters.reviewStatus) {
            pipeline.push(
                {
                    $lookup: {
                        from: "claimreviews",
                        localField: "_id",
                        foreignField: "target",
                        pipeline: [
                            {
                                $match: {
                                    isDeleted: false,
                                    isPublished: true,
                                    isHidden: false,
                                },
                            },
                            { $limit: 1 },
                            { $project: { _id: 1 } },
                        ],
                        as: "publishedReviews",
                    },
                },
                {
                    $match: {
                        "publishedReviews.0": {
                            $exists: filters.reviewStatus === "with",
                        },
                    },
                }
            );
        }

        // Counts ignore the content type filter so every option keeps its
        // number while one is selected.
        const contentModelMatch = filters.contentModel?.length
            ? [
                  {
                      $match: {
                          "latestRevision.contentModel": {
                              $in: filters.contentModel,
                          },
                      },
                  },
              ]
            : [];

        pipeline.push({
            $facet: {
                page: [
                    ...contentModelMatch,
                    { $sort: sort },
                    // pageSize 0 means no limit, as in find()
                    ...(pageSize > 0
                        ? [{ $skip: page * pageSize }, { $limit: pageSize }]
                        : []),
                    { $project: { _id: 1 } },
                ],
                total: [...contentModelMatch, { $count: "count" }],
                contentModelCounts: [
                    {
                        $group: {
                            _id: "$latestRevision.contentModel",
                            count: { $sum: 1 },
                        },
                    },
                ],
            },
        });

        const [result] = await this.ClaimModel.aggregate(pipeline);
        const ids: Types.ObjectId[] = result.page.map(
            ({ _id }: { _id: Types.ObjectId }) => _id
        );
        const claims = await this.ClaimModel.find({ _id: { $in: ids } })
            .populate("latestRevision")
            .lean();
        const byId = new Map(
            claims.map((claim: any) => [String(claim._id), claim])
        );

        const data = await Promise.all(
            ids
                .map((id) => byId.get(String(id)))
                .filter(Boolean)
                .map((claim: any) =>
                    this.postProcess({ ...claim.latestRevision, ...claim })
                )
        );

        return {
            data,
            total: result.total[0]?.count ?? 0,
            contentModelCounts: mapAggregateToRecord<number>(
                result.contentModelCounts,
                "count"
            ),
        };
    }

    async count(query: FilterQuery<ClaimDocument> = {}): Promise<number> {
        return this.ClaimModel.countDocuments(query);
    }

    /**
     * This function will create a new claim and claim Revision and save it to the dataBase.
     * Also creates a History Module that tracks creation of claims.
     * @param claim ClaimBody received of the client.
     * @returns Return a new claim object.
     */
    async create(claim: Record<string, any>) {
        const safeNameSpace =
            typeof claim.nameSpace === "string" ? claim.nameSpace : undefined;
        const userId = this.req.user?._id;

        this.logger.debug(
            `Creating claim — contentModel=${claim.contentModel} nameSpace=${
                safeNameSpace ?? "main"
            } personalities=${
                claim.personalities?.length ?? 0
            } hasGroup=${!!claim.group} user=${userId || "anonymous"}`
        );

        try {
            const generatedSlug = deriveClaimSlug(claim.title);

            const existingClaim = await this.ClaimModel.findOne({
                slug: generatedSlug,
                nameSpace: { $eq: safeNameSpace },
                isDeleted: false,
            });

            if (existingClaim) {
                this.logger.warn(
                    `Duplicate claim title — slug=${generatedSlug} nameSpace=${
                        safeNameSpace ?? "main"
                    } existingId=${existingClaim._id}`
                );
                throw new ConflictException(
                    "There is already a claim with this title."
                );
            }

            claim.slug = generatedSlug;

            claim.personalities = claim.personalities.map(
                (personality: string) => {
                    return new Types.ObjectId(personality);
                }
            );

            if (claim.group) {
                claim.group = new Types.ObjectId(claim.group);
            }

            const newClaim = new this.ClaimModel(claim);

            this.logger.debug(
                `Persisting claim revision — claimId=${newClaim._id} slug=${generatedSlug}`
            );
            const newClaimRevision = await this.claimRevisionService.create(
                newClaim._id,
                claim
            );

            newClaim.latestRevision = newClaimRevision._id;
            newClaim.slug = newClaimRevision.slug;

            const history = this.historyService.getHistoryParams(
                newClaim._id,
                TargetModel.Claim,
                userId,
                HistoryType.Create,
                newClaim.latestRevision
            );
            const stateEvent = this.stateEventService.getStateEventParams(
                newClaim._id,
                TypeModel.Claim
            );

            await this.historyService.createHistory(history as any);
            await this.stateEventService.createStateEvent(stateEvent as any);

            if (claim.group) {
                await this.groupService.updateWithTargetId(
                    claim.group,
                    newClaim._id
                );
            }

            await newClaim.save();

            this.logger.log(
                `Claim created successfully — id=${newClaim._id} contentModel=${claim.contentModel} slug=${newClaim.slug} revision=${newClaimRevision._id}`
            );

            return {
                ...newClaimRevision.toObject(),
                ...newClaim.toObject(),
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            const err = error as Error;
            this.logger.error(
                `Failed to create claim — contentModel=${
                    claim.contentModel
                } nameSpace=${safeNameSpace ?? "main"}: ${err.message}`,
                err.stack
            );
            throw error;
        }
    }

    /**
     * This function creates a new claim with the old claim data
     * and overwrite with the new data, keeping data that hasn't changed.
     * Also creates a History Module that tracks updation of claims.
     * @param claimId Claim id which wants updated.
     * @param claimRevisionUpdate ClaimBody received of the client.
     * @returns Return a new claim object.
     */
    async update(claimId: string, claimRevisionUpdate: Record<string, any>) {
        const claim = await this._getClaim(
            { _id: claimId, isHidden: false },
            undefined,
            false
        );
        const previousRevision = claim.toObject().latestRevision;
        delete previousRevision._id;
        const newClaimRevision = await this.claimRevisionService.create(
            claim._id,
            {
                ...previousRevision,
                ...claimRevisionUpdate,
            }
        );
        claim.latestRevision = newClaimRevision._id;
        claim.slug = newClaimRevision.slug;

        const user = this.req.user?._id;

        const history = this.historyService.getHistoryParams(
            claimId,
            TargetModel.Claim,
            user,
            HistoryType.Update,
            newClaimRevision,
            previousRevision
        );

        await this.historyService.createHistory(history as any);

        claim.save();
        return newClaimRevision;
    }

    /**
     * Executes a soft delete on a specific claim record.
     * * @param {string} claimId - The ID of the claim to mark as deleted.
     * @returns {Promise<Claim>} The claim document with isDeleted set to true.
     */
    async delete(claimId: string) {
        const user = this.req.user?._id;
        this.logger.log(
            `Initiating soft delete for claimId: ${claimId} by user: ${
                user || "system"
            }`
        );
        try {
            const previousClaim = await this.getById(claimId);
            if (!previousClaim) {
                this.logger.warn(
                    `Attempted to soft delete non-existent claimId: ${claimId}`
                );
                return null;
            }

            const history = this.historyService.getHistoryParams(
                claimId,
                TargetModel.Claim,
                user,
                HistoryType.Delete,
                null,
                previousClaim
            );
            await this.historyService.createHistory(history as any);

            const result = await this.ClaimModel.softDelete({ _id: claimId });
            this.logger.log(
                `Claim ${claimId} successfully marked as isDeleted`
            );

            return result;
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Error during soft delete for claimId: ${claimId}. Details: ${err.message}`
            );
            throw error;
        }
    }

    async hideOrUnhideClaim(
        claimId: string,
        isHidden: boolean,
        description?: string
    ): Promise<UpdateWriteOpResult> {
        try {
            const claim = await this.ClaimModel.findById(claimId);

            if (!claim) {
                throw new NotFoundException("Claim not found");
            }

            const before = { isHidden: !isHidden };
            const after = isHidden ? { isHidden, description } : { isHidden };

            const history = this.historyService.getHistoryParams(
                claim._id,
                TargetModel.Claim,
                this.req.user?._id,
                isHidden ? HistoryType.Hide : HistoryType.Unhide,
                after,
                before
            );
            await this.historyService.createHistory(history as any);

            return await this.ClaimModel.updateOne(
                { _id: claim._id },
                { $set: { isHidden } }
            );
        } catch (e) {
            this.logger.error("Failed to update claim:", e);
            throw new NotFoundException();
        }
    }

    async getById(claimId: string, nameSpace: string = NameSpaceEnum.Main) {
        return this._getClaim(
            this.util.getParamsBasedOnUserRole(
                { _id: claimId, nameSpace },
                this.req
            ) as ClaimMatchParameters
        );
    }

    async getByClaimSlug(
        claimSlug: string,
        revisionId: string | undefined = undefined,
        population = true
    ) {
        const nameSpace = this.req.params.namespace || NameSpaceEnum.Main;
        const queryOptions = this.util.getParamsBasedOnUserRole(
            {
                slug: claimSlug,
                nameSpace,
            },
            this.req
        );
        return this._getClaim(
            queryOptions as ClaimMatchParameters,
            revisionId,
            true,
            population
        );
    }

    /**
     * Retrieves the claim IDs associated with a specific personality based on the user's role.
     * This method searches for claims matching the given personality ID and namespace,
     * selecting only the '_id' field for efficiency.
     * @param {string} personalityId - The unique identifier of the personality.
     * @param {NameSpaceEnum} [nameSpace=NameSpaceEnum.Main] - The namespace to filter the claims.
     * @returns {Promise<Array<{ _id: any }>>} A promise that resolves to an array of claim documents containing only their IDs.
s    */
    async getByPersonalityId(
        personalityId: string,
        nameSpace = NameSpaceEnum.Main
    ) {
        this.logger.debug(
            `Fetching claim IDs for personality: ${personalityId}`
        );
        try {
            const queryOptions = this.util.getParamsBasedOnUserRole(
                { personalities: personalityId, nameSpace },
                this.req
            );

            const result = await this.ClaimModel.find(queryOptions)
                .select("_id")
                .lean()
                .exec();

            this.logger.debug(
                `Found ${result.length} claims for personality ${personalityId}`
            );
            return result;
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to fetch claims for personality ${personalityId}`,
                err.stack
            );
            throw new InternalServerErrorException(
                "Error while fetching claims by personality."
            );
        }
    }

    async getByPersonalityIdAndClaimSlug(
        personalityId: string,
        claimSlug: string,
        revisionId: string | undefined = undefined,
        population = true
    ) {
        const nameSpace = this.req.params.namespace || NameSpaceEnum.Main;
        const queryOptions = this.util.getParamsBasedOnUserRole(
            {
                personalities: personalityId,
                slug: claimSlug,
                nameSpace,
            },
            this.req
        );
        return this._getClaim(
            queryOptions as ClaimMatchParameters,
            revisionId,
            true,
            population
        );
    }

    private async _getClaim(
        match: ClaimMatchParameters,
        revisionId: string | undefined = undefined,
        postprocess = true,
        population = true
    ) {
        try {
            let claim;
            if (revisionId) {
                const rawClaim = await this.ClaimModel.findOne(match)
                    .populate("sources", "_id href")
                    .select({ latestRevision: 0 });

                if (!rawClaim) {
                    throw new NotFoundException();
                }

                const revision = await this.claimRevisionService.getRevision({
                    _id: revisionId,
                    claimId: rawClaim._id,
                });

                if (!revision) {
                    throw new NotFoundException();
                }

                claim = {
                    ...rawClaim.toObject(),
                    ...revision,
                    _id: rawClaim._id,
                };
            } else {
                if (population) {
                    claim = await this.ClaimModel.findOne(match)
                        .populate("personalities")
                        .populate("sources", "_id href")
                        .populate("latestRevision")
                        .lean();
                } else {
                    const foundClaim = await this.ClaimModel.findOne(
                        match,
                        "_id personalities latestRevision isHidden"
                    )
                        .populate("personalities", "_id name")
                        .populate("sources", "_id href")
                        .populate({
                            path: "latestRevision",
                            select: {
                                title: 1,
                                contentModel: 1,
                                date: 1,
                                slug: 1,
                            },
                        })
                        .lean();

                    if (!foundClaim) {
                        throw new NotFoundException();
                    }

                    claim = {
                        ...foundClaim.latestRevision,
                        ...foundClaim,
                        latestRevision: undefined,
                    };
                }
            }
            if (!claim) {
                throw new NotFoundException();
            }
            return postprocess === true && population === true
                ? this.postProcess(claim)
                : claim;
        } catch (e) {
            throw new NotFoundException();
        }
    }

    private async postProcess(claim: any) {
        let processedClaim = {
            ...(claim?.latestRevision || claim?.revision),
            ...claim,
            latestRevision: undefined,
        };
        if (claim) {
            const reviews =
                await this.claimReviewService.getReviewClassificationCountsByClaimId(
                    claim._id
                );
            const reviewTasks =
                await this.reviewTaskService.getReviewTasksByClaimId(claim._id);

            processedClaim.content = getClaimContent(processedClaim);
            annotateClaimContent(processedClaim, reviews, reviewTasks);

            const reviewStats =
                await this.claimReviewService.getReviewStatsByClaimId(
                    claim._id
                );
            const overallStats = calculateOverallStats(processedClaim);
            const stats = { ...reviewStats, ...overallStats };
            processedClaim = Object.assign(processedClaim, { stats });
        }
        return processedClaim;
    }
}
