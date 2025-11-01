import { isValidObjectId, Model, Types } from "mongoose";
import { SourceService } from "../source/source.service";
import {
    VerificationRequest,
    VerificationRequestDocument,
} from "./schemas/verification-request.schema";
import { InjectModel } from "@nestjs/mongoose";
import { GroupService } from "../group/group.service";
import { UpdateVerificationRequestDTO } from "./dto/update-verification-request.dto";
import { OpenAIEmbeddings } from "@langchain/openai";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../types";
import { HistoryService } from "../history/history.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { AiTaskService } from "../ai-task/ai-task.service";
import { CreateAiTaskDto } from "../ai-task/dto/create-ai-task.dto";
import { VerificationRequestStateMachineService } from "./state-machine/verification-request.state-machine.service";
import {
    BadRequestException,
    Injectable,
    Inject,
    forwardRef,
    Logger,
    Scope,
} from "@nestjs/common";
import {
    AI_TASK_TIMEOUT,
    EXPECTED_STATES,
    MAX_RETRY_ATTEMPTS,
    SeverityEnum,
    VerificationRequestStatus,
} from "./dto/types";
import * as crypto from "crypto";
import { TopicService } from "../topic/topic.service";
import { IPersonalityService } from "../interfaces/personality.service.interface";

const md5 = require("md5");

@Injectable({ scope: Scope.REQUEST })
export class VerificationRequestService {
    private readonly logger = new Logger(VerificationRequestService.name);

    constructor(
        @Inject(REQUEST) private readonly req: BaseRequest,
        @InjectModel(VerificationRequest.name)
        private VerificationRequestModel: Model<VerificationRequestDocument>,
        @Inject(forwardRef(() => VerificationRequestStateMachineService))
        private readonly verificationRequestStateService: VerificationRequestStateMachineService,
        private sourceService: SourceService,
        private readonly groupService: GroupService,
        private readonly historyService: HistoryService,
        private readonly aiTaskService: AiTaskService,
        private readonly topicService: TopicService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService
    ) {}

    async listAll({ page, pageSize, order, ...filters }): Promise<VerificationRequest[]> {
        const query = await this.buildVerificationRequestQuery(filters);
        return this.VerificationRequestModel.find(query, { embedding: 0 })
            .populate("impactArea")
            .skip(page * parseInt(pageSize, 10))
            .limit(parseInt(pageSize, 10))
            .sort({ _id: order })
            .lean();
    }

    /**
     * Find all verification requests that query matches
     * @param verifiedRequestQuery query parameter
     * @returns an array of verification request documents
     */
    async findAll(verifiedRequestQuery: {
        searchContent: string;
    }): Promise<VerificationRequest[]> {
        return this.VerificationRequestModel.find(
            {
                content: {
                    $regex: verifiedRequestQuery.searchContent || "",
                    $options: "i",
                },
            },
            { embedding: 0 }
        );
    }

    /**
     * Finds a document by an id parameter
     * @param verificationRequestId verification request ID string
     * @returns the verification request document
     */
    async getById(verificationRequestId: string): Promise<VerificationRequest> {
        return this.VerificationRequestModel.findById(verificationRequestId, {
            embedding: 0,
        }).populate("group");
    }

    /**
     * Get verification request by ID with specific fields populated
     * @param verificationRequestId verification request ID
     * @param fieldsToPopulate array of field names to populate
     * @returns the verification request document with populated fields
     */
    async getByIdWithPopulatedFields(
        verificationRequestId: string,
        fieldsToPopulate: string[] = []
    ): Promise<VerificationRequest> {
        let query = this.VerificationRequestModel.findById(
            verificationRequestId,
            { embedding: 0 }
        );

        fieldsToPopulate.forEach((field) => {
            query = query.populate(field);
        });

        return query.exec();
    }

    /**
     * Creates a new verification request document
     * Executes the createEmbed function to store the verification request content embedding
     * For each sources in verification request, creates a new source document
     * @param verificationRequest verificationRequestBody
     * @returns the verification request document
     */
    async create(
        data: {
            content: string;
            impactArea?: { label: string; value: string } | string;
            source?: Array<{ href: string }>;
        },
        user?: any
    ): Promise<VerificationRequestDocument> {
        try {
            this.logger.debug("Creating verification request", { data });

            const vr = await this.VerificationRequestModel.create({
                ...data,
                data_hash: md5(data.content),
                embedding: null,
                source: null,
                impactArea: null,
            });

            const validSources =
                data.source?.filter((source) => source?.href?.trim()) || [];

            if (validSources.length) {
                const srcId = await Promise.all(
                    validSources.map(async (source) => {
                        const src = await this.sourceService.create({
                            href: source.href,
                            targetId: vr.id,
                        });
                        return src._id;
                    })
                );

                vr.source = srcId;
                await vr.save();
            }

            if (data.impactArea) {
                const topicWikidataEntities = [data.impactArea];
                const createdTopic = await this.topicService.create({
                    topics: topicWikidataEntities,
                });

                vr.impactArea = Types.ObjectId(createdTopic[0].id);
                await vr.save();
            }

            const currentUser = user || this.req?.user;

            const history = this.historyService.getHistoryParams(
                vr._id,
                TargetModel.VerificationRequest,
                currentUser,
                HistoryType.Create,
                vr
            );

            await this.historyService.createHistory(history);

            this.logger.log(
                `Verification request created successfully: ${vr._id}`
            );
            return vr;
        } catch (e) {
            this.logger.error("Failed to create verification request", e.stack);

            if (e.name === "ValidationError") {
                const fields = Object.keys(e.errors).join(", ");
                throw new BadRequestException(
                    `Validation failed: ${fields} are invalid or missing`
                );
            }

            if (e.code === 11000) {
                const field = Object.keys(e.keyPattern)[0];
                throw new BadRequestException(
                    `Duplicate value for field: ${field}`
                );
            }

            throw new BadRequestException(
                "Failed to create verification request"
            );
        }
    }

    /**
     * Generic function to create AI Task based on the state machine
     * Prevents duplicate task creation by tracking pending tasks
     * */
    async createAiTask(taskDto: CreateAiTaskDto) {
        const targetId = taskDto.callbackParams?.targetId;
        const field = taskDto.callbackParams?.field;

        if (!targetId || !field) {
            this.logger.log(
                `Creating AI task without tracking: ${taskDto.type}`,
                { taskDto }
            );
            await this.aiTaskService.create(taskDto);
            return { success: true };
        }

        // Check if this task is already pending
        const vr = await this.VerificationRequestModel.findById(targetId);
        if (!vr) {
            throw new BadRequestException(
                `VerificationRequest ${targetId} not found`
            );
        }

        const existingTaskId = vr.pendingAiTasks?.get(field);
        if (existingTaskId) {
            this.logger.log(
                `AI task already exists for ${field} on VR ${targetId}: ${existingTaskId}. Skipping creation.`
            );
            return { success: true, skipped: true, existingTaskId };
        }

        // Create the task
        this.logger.log(
            `Creating AI task: ${taskDto.type} for VR ${targetId}`,
            { taskDto }
        );
        const task = await this.aiTaskService.create(taskDto);

        // Track the pending task
        await this.VerificationRequestModel.findByIdAndUpdate(targetId, {
            $set: { [`pendingAiTasks.${field}`]: task._id.toString() },
        });

        this.logger.log(
            `Tracked AI task ${task._id} for field ${field} on VR ${targetId}`
        );

        return { success: true, taskId: task._id };
    }

    async updateFieldByAiTask(
        params: { targetId: string; field: string },
        result: any
    ) {
        const startTime = Date.now();
        const { targetId, field } = params;

        this.logger.log(
            `[updateFieldByAiTask] Updating VR ${targetId} for field: ${field}`
        );
        this.logger.log(
            `[updateFieldByAiTask] Received result type: ${typeof result}, value:`,
            result
        );

        try {
            const verificationRequest =
                await this.VerificationRequestModel.findById(targetId);
            if (!verificationRequest) {
                throw new BadRequestException(
                    `VerificationRequest ${targetId} not found`
                );
            }

            // Check idempotency
            const resultHash = this.hashResult(result);
            const existingHash =
                verificationRequest.stateFingerprints?.get(field);

            if (existingHash === resultHash) {
                this.logger.log(
                    `Duplicate ${field} update detected for ${targetId}, skipping`
                );
                return verificationRequest;
            }

            // Extract value based on field type
            let valueToUpdate: any;
            switch (field) {
                case "embedding":
                    valueToUpdate = result;
                    break;
                case "identifiedData":
                    this.logger.log(
                        `Processing identifiedData with personalities array:`,
                        result
                    );

                    if (
                        result?.personalities &&
                        Array.isArray(result.personalities)
                    ) {
                        const personalityIds = await Promise.all(
                            result.personalities.map(
                                async (personalityData) => {
                                    const personality =
                                        await this.personalityService.findOrCreatePersonality(
                                            {
                                                name: personalityData.name,
                                                wikidata:
                                                    personalityData.wikidata,
                                            }
                                        );
                                    return (personality as any)._id;
                                }
                            )
                        );

                        valueToUpdate = personalityIds;
                        this.logger.log(
                            `Personalities created/found with IDs: ${personalityIds.join(
                                ", "
                            )}`
                        );
                    } else {
                        this.logger.warn(
                            `Unexpected identifiedData format, setting empty array`
                        );
                        valueToUpdate = [];
                    }
                    break;
                case "topics":
                    this.logger.log(
                        `Creating/finding topics for topics array:`,
                        result
                    );

                    if (!Array.isArray(result)) {
                        throw new BadRequestException(
                            `Topics must be an array, got: ${typeof result}`
                        );
                    }

                    const topicIds = await Promise.all(
                        result.map(async (topicData) => {
                            const topic =
                                await this.topicService.findOrCreateTopic(
                                    topicData
                                );
                            return (topic as any)._id;
                        })
                    );

                    valueToUpdate = topicIds;
                    this.logger.log(
                        `Topics created/found with IDs: ${topicIds.join(", ")}`
                    );
                    break;
                case "impactArea":
                    this.logger.log(
                        `Creating/finding topic for impact area:`,
                        result
                    );
                    const topic = await this.topicService.findOrCreateTopic(
                        result
                    );
                    valueToUpdate = (topic as any)._id;
                    this.logger.log(
                        `Impact area topic created/found with ID: ${valueToUpdate}`
                    );
                    break;
                case "severity":
                    if (typeof result === "string") {
                        valueToUpdate = result;
                    } else if (result?.severity) {
                        valueToUpdate = result.severity;
                    } else {
                        throw new BadRequestException(
                            `Invalid severity result format: ${JSON.stringify(
                                result
                            )}`
                        );
                    }
                    this.logger.log(
                        `Extracted severity: ${valueToUpdate} from result:`,
                        result
                    );
                    break;
                default:
                    throw new BadRequestException(`Invalid field: ${field}`);
            }

            // Validate result
            const validation = this.validateAiTaskResult(field, valueToUpdate);
            if (!validation.valid) {
                await this.handleInvalidResult(
                    targetId,
                    field,
                    validation.error
                );
                throw new BadRequestException(
                    `Invalid ${field} result: ${validation.error}`
                );
            }

            // Use atomic operations to prevent race conditions
            // $set for field updates, $addToSet for array (prevents duplicates), $unset for clearing
            const updateData: any = {
                $set: {
                    [field]: valueToUpdate,
                    [`stateFingerprints.${field}`]: resultHash,
                },
                $addToSet: {
                    statesExecuted: field, // Atomic array addition, no duplicates
                },
                $unset: {
                    [`pendingAiTasks.${field}`]: "", // Clear pending task
                },
            };

            // If severity is being updated, transition status to IN_TRIAGE
            if (field === "severity") {
                updateData.$set.status = "In Triage";
                this.logger.log(
                    `Transitioning VR ${targetId} status to IN_TRIAGE after severity definition`
                );
            }

            // Use atomic update to prevent race conditions when multiple callbacks complete simultaneously
            const updated =
                await this.VerificationRequestModel.findByIdAndUpdate(
                    targetId,
                    updateData,
                    { new: true }
                ).exec();

            this.logger.log(
                `Cleared pending AI task for ${field} on VR ${targetId}`
            );

            // Track state transition
            const duration = Date.now() - startTime;
            const fromState =
                verificationRequest.statesExecuted?.slice(-1)[0] || "initial";
            await this.trackStateTransition(
                updated,
                fromState,
                field,
                duration
            );
            await this.updateProgress(updated);

            // Revalidate and trigger missing states (with parallel execution)
            await this.revalidateAndRunMissingStatesWithParallel(updated);

            return updated;
        } catch (error) {
            await this.handleStateError(targetId, field, error.message);
            throw error;
        }
    }

    /**
     * Revalidates the verification request and triggers missing states
     * based on what steps have already been executed
     */
    async revalidateAndRunMissingStates(
        verificationRequest: VerificationRequestDocument
    ) {
        const statesExecuted = verificationRequest.statesExecuted || [];
        const pendingTasks = verificationRequest.pendingAiTasks || new Map();

        this.logger.log(
            `[revalidateAndRunMissingStates] VR ${
                verificationRequest.id
            }, states executed: ${statesExecuted.join(
                ", "
            )}, pending: ${Object.keys(pendingTasks).join(", ")}`
        );

        // If severity is completed, we're done - status should be IN_TRIAGE
        if (statesExecuted.includes("severity")) {
            this.logger.log(
                `All states completed for VR ${verificationRequest.id}, status is IN_TRIAGE`
            );
            return;
        }

        // Define the expected order of states
        const expectedStates = [
            "embedding",
            "identifiedData",
            "topics",
            "impactArea",
            "severity",
        ];

        // Find the next missing state to execute
        for (const state of expectedStates) {
            const isExecuted = statesExecuted.includes(state);
            const isPending =
                pendingTasks.has(state) || pendingTasks.get(state);

            // Skip if already executed OR already pending
            if (isExecuted || isPending) {
                this.logger.log(
                    `[revalidateAndRunMissingStates] State ${state} is ${
                        isExecuted ? "executed" : "pending"
                    }, skipping`
                );
                continue;
            }

            this.logger.log(
                `Missing state found: ${state}, triggering state machine`
            );

            // Trigger the state machine to continue from where it left off
            await this.triggerStateMachineForMissingState(
                verificationRequest,
                state
            );

            // Only trigger one missing state at a time
            // The state machine will handle the rest sequentially
            break;
        }
    }

    /**
     * Triggers the state machine to execute a specific missing state
     */
    async triggerStateMachineForMissingState(
        verificationRequest: VerificationRequestDocument,
        missingState: string
    ) {
        this.logger.log(
            `Triggering state machine for VR ${verificationRequest.id} to execute: ${missingState}`
        );

        // Map field names to state machine events
        const stateToEventMap = {
            embedding: "embed",
            identifiedData: "identifyData",
            topics: "defineTopics",
            impactArea: "defineImpactArea",
            severity: "defineSeverity",
        };

        const event = stateToEventMap[missingState];
        if (!event) {
            this.logger.warn(
                `No event mapping found for state: ${missingState}`
            );
            return;
        }

        try {
            // Trigger the state machine with the appropriate event
            await this.verificationRequestStateService[event](
                verificationRequest.id
            );
        } catch (error) {
            this.logger.error(
                `Failed to trigger state machine for ${missingState}: ${error.message}`,
                error.stack
            );
        }
    }

    /**
     * Finds a document by an data_hash parameter
     * @param data_hash encrypted hash
     * @returns the verification request document
     */
    async findByDataHash(
        data_hash: string,
        populate = true
    ): Promise<VerificationRequestDocument> {
        if (populate) {
            return this.VerificationRequestModel.findOne({
                data_hash,
            })
                .populate("group")
                .populate("source")
                .populate("impactArea");
        }

        return this.VerificationRequestModel.findOne({ data_hash });
    }

    /**
     * Find the removed ids based on an initial object and an updated object
     * @param initial initial object
     * @param updated updated object
     * @returns the removed ids
     */
    findRemovedIds(initial, updated): string[] {
        return initial.content.filter(
            (id) => !updated.content.includes(id.toString())
        );
    }

    /**
     * Removes a specific verification request document in the group content document
     * @param verificationRequestId verification request ID
     * @param groupId group ID
     * @returns updated verification request document
     */
    async removeVerificationRequestFromGroup(
        verificationRequestId: string,
        groupId: string
    ): Promise<VerificationRequestDocument> {
        try {
            const verificationRequest =
                await this.VerificationRequestModel.findById(
                    verificationRequestId
                );

            await this.groupService.removeContent(
                groupId,
                verificationRequest._id
            );

            return await this.VerificationRequestModel.findByIdAndUpdate(
                verificationRequest._id,
                { $unset: { group: null } },
                { new: true, upsert: true }
            );
        } catch (error) {
            console.error(
                "Failed to remove verification request from group:",
                error
            );
            throw error;
        }
    }

    /**
     * Updates the verification request document
     * @param verificationRequestId verification request id
     * @param verificationRequestBodyUpdate verification request updated object
     * @param postProcess boolean
     * @returns the updated verification request document
     */
    async update(
        verificationRequestId: string,
        verificationRequestBodyUpdate: Partial<UpdateVerificationRequestDTO>,
        postProcess: boolean = true
    ): Promise<VerificationRequestDocument> {
        try {
            const verificationRequest =
                await this.VerificationRequestModel.findById(
                    verificationRequestId
                ).populate("group");

            if (!verificationRequest) {
                throw new Error("Verification request not found");
            }

            const latestVerificationRequest = verificationRequest.toObject();

            const updatedVerificationRequestData = {
                ...latestVerificationRequest,
                ...verificationRequestBodyUpdate,
                publicationDate:
                    verificationRequestBodyUpdate.publicationDate ??
                    verificationRequest.publicationDate,
            };

            if (verificationRequestBodyUpdate.source?.length) {
                const newSourceIds = await Promise.all(
                    verificationRequestBodyUpdate.source.map(async (source) => {
                        const src = await this.sourceService.create({
                            href: source.href,
                            targetId: verificationRequest.id,
                        });

                        return src._id;
                    })
                );

                updatedVerificationRequestData.source = Array.from(
                    new Set([
                        ...(verificationRequest.source || []).map((sourceId) =>
                            sourceId.toString()
                        ),
                        ...newSourceIds.map((id) => id.toString()),
                    ])
                ).map((id) => Types.ObjectId(id));
            }

            if (
                postProcess &&
                Array.isArray(updatedVerificationRequestData.group)
            ) {
                updatedVerificationRequestData.group =
                    await this.handleGroupPostProcessing(
                        verificationRequest,
                        updatedVerificationRequestData
                    );
            }

            const user = this.req.user;

            const history = this.historyService.getHistoryParams(
                verificationRequest._id,
                TargetModel.VerificationRequest,
                user,
                HistoryType.Update,
                updatedVerificationRequestData,
                latestVerificationRequest
            );

            await this.historyService.createHistory(history);

            return await this.VerificationRequestModel.findByIdAndUpdate(
                verificationRequest._id,
                updatedVerificationRequestData,
                { new: true, upsert: true }
            ).populate("source");
        } catch (error) {
            console.error("Failed to update verification request:", error);
            throw error;
        }
    }

    /**
     * Finds the removed group ids and update their document
     * Creates a new group document and updates all verification requests that are part of this group with the group ID
     * @param originalVerificationRequest verification request original object
     * @param updatedVerificationRequest verification request updated object
     * @returns the group id
     */
    private async handleGroupPostProcessing(
        originalVerificationRequest,
        updatedVerificationRequest
    ) {
        if (originalVerificationRequest?.group) {
            await this.delete(
                originalVerificationRequest,
                updatedVerificationRequest
            );
        }

        return await this.createGroupAndUpdateVerificationRequests(
            originalVerificationRequest,
            updatedVerificationRequest
        );
    }

    /**
     * Finds the removed group ids and update their document
     * @param originalVerificationRequest verification request original object
     * @param updatedVerificationRequest verification request updated object
     */
    private async delete(
        originalVerificationRequest,
        updatedVerificationRequest
    ) {
        const removedRequestIds = await Promise.all(
            this.findRemovedIds(originalVerificationRequest?.group, {
                content: [
                    originalVerificationRequest._id.toString(),
                    ...updatedVerificationRequest.group,
                ],
            })
        );

        const flattenedRemovedIds = removedRequestIds.flat();

        if (flattenedRemovedIds?.length) {
            await Promise.all(
                flattenedRemovedIds.map((id) =>
                    this.update(id, { group: null }, false)
                )
            );
        }
    }

    /**
     * Creates a new group document and updates all verification requests that are part of this group with the group ID
     * @param originalVerificationRequest verification request original object
     * @param updatedVerificationRequest verification request updated object
     * @returns the group id
     */
    private async createGroupAndUpdateVerificationRequests(
        originalVerificationRequest,
        updatedVerificationRequest
    ) {
        const contentIds =
            updatedVerificationRequest?.group?.map((item) =>
                Types.ObjectId(item?._id || item)
            ) || [];

        const groupId = (
            await this.groupService.create({
                content: [originalVerificationRequest._id, ...contentIds],
            })
        )._id;

        if (contentIds.length) {
            await Promise.all(
                contentIds.map((itemId) =>
                    this.update(itemId, { group: groupId }, false)
                )
            );
        }

        return groupId;
    }

    async count(filters): Promise<number> {
        const query = await this.buildVerificationRequestQuery(filters);
        return this.VerificationRequestModel.countDocuments(query);
    }

    /**
     * Creates an embedding based on a query parameter
     * @param content verification request content
     * @returns verification request content embedding
     */
    createEmbedContent(content: string): Promise<number[]> {
        const embeddings = new OpenAIEmbeddings();

        return embeddings.embedQuery(content);
    }

    /**
     * Find similar verification requests related to the embedding content
     * @param queryEmbedding embedding array to find similarities for
     * @param filter verification requests IDs to filter, does not recommend verification requests those are part of the same group
     * @param pageSize limit of documents
     * @returns Verification requests with the similarity score greater than 0.80, or empty array if embedding is null/empty
     */
    async findSimilarRequests(
        queryEmbedding: number[],
        filter,
        pageSize
    ): Promise<VerificationRequest[]> {
        if (!queryEmbedding || queryEmbedding.length === 0) {
            return [];
        }
        const filterIds = filter.map((verificationRequestId) =>
            Types.ObjectId(verificationRequestId)
        );

        return await this.VerificationRequestModel.aggregate([
            { $match: { _id: { $nin: filterIds } } },
            {
                $addFields: {
                    similarity: {
                        $reduce: {
                            input: {
                                $zip: {
                                    inputs: ["$embedding", queryEmbedding],
                                },
                            },
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    {
                                        $multiply: [
                                            { $arrayElemAt: ["$$this", 0] },
                                            { $arrayElemAt: ["$$this", 1] },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $match: {
                    similarity: { $gte: 0.8, $type: "number" },
                },
            },
            {
                $lookup: {
                    from: "sources",
                    localField: "source",
                    foreignField: "_id",
                    as: "source",
                },
            },
            {
                $project: {
                    embedding: 0,
                },
            },
            {
                $sort: { similarity: -1 },
            },
            {
                $limit: parseInt(pageSize),
            },
        ]);
    }

    async updateVerificationRequestWithTopics(topics, data_hash) {
        const verificationRequest = await this.findByDataHash(data_hash, false);

        const latestVerificationRequest = verificationRequest.toObject();

        const newVerificationRequest = {
            ...latestVerificationRequest,
            topics,
        };

        const user = this.req.user;

        const history = this.historyService.getHistoryParams(
            verificationRequest._id,
            TargetModel.VerificationRequest,
            user,
            HistoryType.Update,
            newVerificationRequest,
            latestVerificationRequest
        );

        await this.historyService.createHistory(history);

        return this.VerificationRequestModel.updateOne(
            { _id: verificationRequest._id },
            newVerificationRequest
        );
    }

    private async buildVerificationRequestQuery(filters: {
        contentFilters?: string[];
        topics?: string[];
        severity?: string;
        sourceChannel?: string;
        status?: string[];
        impactArea?: string[];
    }): Promise<Record<string, any>> {
        const { contentFilters, topics, severity, sourceChannel, status, impactArea } = filters;
        const query: any = {};
        
        const orConditions: any[] = [];

        const [topicsObj, impactAreasObj] = await Promise.all([
            topics?.length ? this.topicService.findByNames(topics) : [],
            impactArea?.length ? this.topicService.findByNames(impactArea) : [],
        ]);

        const topicIds = topicsObj.map(topics => topics.wikidataId);
        const impactAreaIds = impactAreasObj.map(impactArea => Types.ObjectId(impactArea._id));

        if (topicIds.length) orConditions.push({ "topics.value": { $in: topicIds } });

        if (impactAreaIds.length) orConditions.push({ impactArea: { $in: impactAreaIds } });

        if (contentFilters?.length) {
            const contentConditions = contentFilters.map((filter) => ({
                content: { $regex: filter, $options: "i" },
            }));
            orConditions.push(...contentConditions);
        }

        if (orConditions.length) {
            query.$or = orConditions;
        }

        if (severity && severity !== "all") {
            query.severity = severity === "critical"
                ? "critical"
                : { $regex: `^${severity}`, $options: "i" };
        }

        if (sourceChannel && sourceChannel !== "all") {
            query.sourceChannel = { $in: sourceChannel };
        }

        if (status?.length) {
            query.status = { $in: status };
        }
        return query;
    }

    /**
     * Validates AI task results before updating
     */
    private validateAiTaskResult(
        field: string,
        result: any
    ): { valid: boolean; error?: string } {
        switch (field) {
            case "embedding":
                if (!Array.isArray(result) || result.length === 0) {
                    return {
                        valid: false,
                        error: "Embedding must be a non-empty array",
                    };
                }
                if (result.some((v) => typeof v !== "number")) {
                    return {
                        valid: false,
                        error: "Embedding must contain only numbers",
                    };
                }
                break;
            case "topics":
                if (!Array.isArray(result) || result.length === 0) {
                    return {
                        valid: false,
                        error: "Topics must be a non-empty array",
                    };
                }
                const allValidIds = result.every((id) => isValidObjectId(id));
                if (!allValidIds) {
                    return {
                        valid: false,
                        error: "All topics must be valid ObjectIds",
                    };
                }
                break;
            case "identifiedData":
                // Allow string or null/empty (AI might not identify anyone)
                if (
                    result === null ||
                    result === undefined ||
                    result === "" ||
                    (Array.isArray(result) && result.length === 0)
                ) {
                    return { valid: true };
                }

                if (Array.isArray(result)) {
                    const allValidIds = result.every((id) =>
                        isValidObjectId(id)
                    );
                    if (allValidIds) {
                        return { valid: true };
                    }
                }

                return {
                    valid: false,
                    error: `Identified data must be an array of ObjectIds, got: ${typeof result}`,
                };
                break;
            case "impactArea":
                if (!result) {
                    return { valid: false, error: "Impact area is required" };
                }
                break;
            case "severity":
                if (
                    !Object.values(SeverityEnum)
                        .map(String)
                        .includes(String(result))
                ) {
                    return {
                        valid: false,
                        error: `Invalid severity value: ${result}`,
                    };
                }
                break;
        }
        return { valid: true };
    }

    /**
     * Hash result for idempotency checks
     */
    private hashResult(result: any): string {
        return crypto
            .createHash("sha256")
            .update(JSON.stringify(result))
            .digest("hex");
    }

    /**
     * Handle invalid AI task result
     */
    private async handleInvalidResult(
        vrId: string,
        state: string,
        error: string
    ) {
        this.logger.error(
            `Invalid result for VR ${vrId}, state ${state}: ${error}`
        );

        const retries = await this.incrementRetryCount(vrId, state);

        if (retries >= MAX_RETRY_ATTEMPTS) {
            await this.markForManualReview(vrId, state, error);
        }
    }

    /**
     * Increment retry count for a state
     */
    private async incrementRetryCount(
        vrId: string,
        state: string
    ): Promise<number> {
        const vr = await this.VerificationRequestModel.findById(vrId);
        const retries = (vr.stateRetries?.get(state) || 0) + 1;

        const stateRetries = new Map(Object.entries(vr.stateRetries || {}));
        stateRetries.set(state, retries);

        await this.VerificationRequestModel.findByIdAndUpdate(vrId, {
            $set: { [`stateRetries.${state}`]: retries },
        });

        return retries;
    }

    /**
     * Mark verification request for manual review
     */
    private async markForManualReview(
        vrId: string,
        state: string,
        reason: string
    ) {
        this.logger.warn(
            `Marking VR ${vrId} for manual review. State: ${state}, Reason: ${reason}`
        );

        await this.VerificationRequestModel.findByIdAndUpdate(vrId, {
            $push: {
                auditLog: {
                    action: "manual_review_required",
                    field: state,
                    timestamp: new Date(),
                    details: { reason, maxRetriesExceeded: true },
                },
            },
            status: "Manual Review Required",
        });
    }

    /**
     * Handle state error
     */
    private async handleStateError(vrId: string, state: string, error: string) {
        this.logger.error(`Error in state ${state} for VR ${vrId}: ${error}`);

        await this.VerificationRequestModel.findByIdAndUpdate(vrId, {
            $push: {
                stateErrors: {
                    state,
                    error,
                    timestamp: new Date(),
                },
            },
        });
    }

    /**
     * Track state transition
     */
    private async trackStateTransition(
        vr: VerificationRequestDocument,
        from: string,
        to: string,
        duration: number
    ) {
        await this.VerificationRequestModel.findByIdAndUpdate(vr._id, {
            $push: {
                stateTransitions: {
                    from,
                    to,
                    timestamp: new Date(),
                    duration,
                },
            },
        });

        this.logger.log(
            `State transition: ${from} -> ${to} in ${duration}ms for VR ${vr.id}`
        );
    }

    /**
     * Update progress tracking
     */
    private async updateProgress(vr: VerificationRequestDocument) {
        const statesExecuted = vr.statesExecuted || [];
        const totalStates = EXPECTED_STATES.length;
        const completed = statesExecuted.length;
        const percentage = (completed / totalStates) * 100;

        const avgDuration = this.calculateAverageDuration(
            vr.stateTransitions || []
        );
        const remainingStates = totalStates - completed;
        const estimatedCompletion =
            avgDuration > 0
                ? new Date(Date.now() + avgDuration * remainingStates)
                : undefined;

        await this.VerificationRequestModel.findByIdAndUpdate(vr._id, {
            progress: {
                current:
                    statesExecuted[statesExecuted.length - 1] || "starting",
                completed,
                total: totalStates,
                percentage,
                estimatedCompletion,
            },
        });
    }

    /**
     * Calculate average duration from transitions
     */
    private calculateAverageDuration(transitions: any[]): number {
        if (!transitions || transitions.length === 0) return 0;

        const total = transitions.reduce(
            (sum, t) => sum + (t.duration || 0),
            0
        );
        return total / transitions.length;
    }

    /**
     * Revalidate and run missing states with parallel execution
     * IMPORTANT: Topics and Impact Area can only run AFTER identifiedData is populated
     *
     * This function only checks statesExecuted and triggers missing states using
     * triggerStateMachineForMissingState with proper validations.
     */
    private async revalidateAndRunMissingStatesWithParallel(
        verificationRequest: VerificationRequestDocument
    ) {
        const statesExecuted = verificationRequest.statesExecuted || [];

        this.logger.log(
            `Revalidating VR ${
                verificationRequest.id
            }, states executed: ${statesExecuted.join(", ")}`
        );

        // If severity is completed, we're done
        if (statesExecuted.includes("severity")) {
            this.logger.log(
                `All states completed for VR ${verificationRequest.id}, status is IN_TRIAGE`
            );
            return;
        }

        // Define the expected order of states
        const expectedStates = [
            "embedding",
            "identifiedData",
            "topics",
            "impactArea",
            "severity",
        ];

        // Find all missing states
        const missingStates = expectedStates.filter(
            (state) => !statesExecuted.includes(state)
        );

        if (missingStates.length === 0) {
            this.logger.log(
                `No missing states for VR ${verificationRequest.id}`
            );
            return;
        }

        this.logger.log(
            `Missing states for VR ${
                verificationRequest.id
            }: ${missingStates.join(", ")}`
        );

        // Trigger missing states with validation checks
        for (const state of missingStates) {
            // Validation: Check prerequisites before triggering
            if (
                (state === "topics" || state === "impactArea") &&
                !statesExecuted.includes("identifiedData")
            ) {
                this.logger.log(
                    `Skipping ${state} for VR ${verificationRequest.id} - identifiedData not yet completed`
                );
                continue;
            }

            if (
                state === "severity" &&
                (!statesExecuted.includes("topics") ||
                    !statesExecuted.includes("impactArea"))
            ) {
                this.logger.log(
                    `Skipping severity for VR ${verificationRequest.id} - topics or impactArea not yet completed`
                );
                continue;
            }

            this.logger.log(
                `Triggering state machine for missing state: ${state} on VR ${verificationRequest.id}`
            );

            await this.triggerStateMachineForMissingState(
                verificationRequest,
                state
            );
        }
    }

    /**
     * Check and retry stale AI tasks
     */
    async checkAndRetryStaleAiTasks() {
        const staleRequests = await this.VerificationRequestModel.find({
            status: VerificationRequestStatus.PRE_TRIAGE,
            updatedAt: { $lt: new Date(Date.now() - AI_TASK_TIMEOUT) },
            $expr: {
                $lt: [
                    { $size: { $ifNull: ["$statesExecuted", []] } },
                    EXPECTED_STATES.length,
                ],
            },
        });

        this.logger.log(
            `Found ${staleRequests.length} stale verification requests`
        );

        for (const request of staleRequests) {
            this.logger.log(`Retrying stale request: ${request.id}`);

            // Clear stale pending tasks first
            await this.clearStalePendingTasks(request);

            // Then retry missing states
            await this.revalidateAndRunMissingStates(request);
        }
    }

    /**
     * Clear pending AI tasks that have been stale for too long
     * This allows the state machine to create new tasks for failed/abandoned tasks
     */
    private async clearStalePendingTasks(vr: VerificationRequestDocument) {
        const pendingTasks = vr.pendingAiTasks;
        if (!pendingTasks || pendingTasks.size === 0) {
            return;
        }

        const tasksToClean: string[] = [];

        for (const [field, _taskId] of Object.entries(pendingTasks)) {
            // Check if the task actually completed but wasn't cleared
            const stateCompleted = vr.statesExecuted?.includes(field);

            if (stateCompleted) {
                this.logger.log(
                    `Cleaning completed but uncleared task for ${field} on VR ${vr.id}`
                );
                tasksToClean.push(field);
                continue;
            }

            // Check if task is truly stale (older than timeout)
            const vrDocument = vr as any; // Cast to access updatedAt
            const vrAge =
                Date.now() -
                new Date(vrDocument.updatedAt || vr.date).getTime();
            if (vrAge > AI_TASK_TIMEOUT) {
                this.logger.log(
                    `Cleaning stale pending task for ${field} on VR ${vr.id} (age: ${vrAge}ms)`
                );
                tasksToClean.push(field);
            }
        }

        if (tasksToClean.length > 0) {
            const unsetObj = {};
            tasksToClean.forEach((field) => {
                unsetObj[`pendingAiTasks.${field}`] = "";
            });

            await this.VerificationRequestModel.findByIdAndUpdate(vr._id, {
                $unset: unsetObj,
            });

            this.logger.log(
                `Cleaned ${tasksToClean.length} stale pending tasks for VR ${vr.id}`
            );
        }
    }

    /**
     * Manual override for a specific field
     */
    async manualOverrideField(
        vrId: string,
        field: string,
        value: any,
        userId: string
    ) {
        this.logger.log(
            `Manual override: VR ${vrId}, field ${field} by user ${userId}`
        );

        const vr = await this.VerificationRequestModel.findById(vrId);
        if (!vr) {
            throw new BadRequestException(
                `VerificationRequest ${vrId} not found`
            );
        }

        // Use atomic operations to prevent race conditions
        const updatedVr = await this.VerificationRequestModel.findByIdAndUpdate(
            vrId,
            {
                $set: {
                    [field]: value,
                },
                $addToSet: {
                    statesExecuted: field, // Atomic array addition, no duplicates
                },
                $push: {
                    auditLog: {
                        action: "manual_override",
                        field,
                        userId,
                        timestamp: new Date(),
                        details: { value },
                    },
                },
            },
            { new: true }
        );

        // Continue with next steps
        await this.revalidateAndRunMissingStates(updatedVr);

        return updatedVr;
    }
}
