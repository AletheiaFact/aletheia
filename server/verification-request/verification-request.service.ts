import {
    BadRequestException,
    Injectable,
    Inject,
    forwardRef,
} from "@nestjs/common";
import { Model, Types } from "mongoose";
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

const md5 = require("md5");

@Injectable({ scope: Scope.REQUEST })
export class VerificationRequestService {
    private readonly logger = new Logger(VerificationRequestService.name);

    constructor(
        @Inject(REQUEST) private readonly req: BaseRequest,
        @InjectModel(VerificationRequest.name)
        private VerificationRequestModel: Model<VerificationRequestDocument>,
        // This is not yet used but it is necessary to properly initialize the module
        @Inject(forwardRef(() => VerificationRequestStateMachineService))
        private readonly verificationRequestStateService: VerificationRequestStateMachineService,
        private sourceService: SourceService,
        private readonly groupService: GroupService,
        private readonly historyService: HistoryService
    ) {}

    async listAll({
        contentFilters,
        page,
        pageSize,
        order,
        topics,
    }): Promise<VerificationRequest[]> {
        const query: any = {};

        if (contentFilters && contentFilters.length > 0) {
            query.$or = contentFilters.map((filter) => ({
                content: { $regex: filter, $options: "i" },
            }));
        }

        if (topics && topics.length > 0) {
            query["topics.label"] = { $in: topics };
        }

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
     * Creates a new verification request document
     * Executes the createEmbed function to store the verification request content embedding
     * For each sources in verification request, creates a new source document
     * @param verificationRequest verificationRequestBody
     * @returns the verification request document
     */
    async create(data: {
        content: string;
        source?: string;
    }): Promise<VerificationRequestDocument> {
        try {
            const vr = await this.VerificationRequestModel.create({
                ...data,
                data_hash: md5(data.content),
                embedding: null,
                source: null,
            });

            if (data.source?.trim()) {
                const src = await this.sourceService.create({
                    href: data.source,
                    targetId: vr.id,
                });
                vr.source = Types.ObjectId(src.id);
                await vr.save();
            }

            const user = this.req.user;

            const history = this.historyService.getHistoryParams(
                vr._id,
                TargetModel.VerificationRequest,
                user,
                HistoryType.Create,
                vr
            );

            await this.historyService.createHistory(history);

            return vr;
        } catch (e) {
            console.error("Failed to create verification request", e);
            throw new Error(e);
        }
    }

    async createAiTask(taskDto: CreateAiTaskDto) {
        await this.aiTaskService.create(taskDto);
        return { success: true };
    }

    /**
     * TODO: when updated the embedding we need add missing states triggered by machine
     * to make sure the machine is in the correct state
     * and we can follow to triage process
     * @param params
     * @param embedding
     * @returns
     */
    async updateEmbedding(
        params: { targetId: string; field: string },
        embedding: number[]
    ) {
        const { targetId, field } = params;
        const updated = await this.VerificationRequestModel.findByIdAndUpdate(
            targetId,
            { [field]: embedding },
            { new: true }
        ).exec();
        if (!updated) {
            throw new BadRequestException(
                `VerificationRequest ${targetId} not found`
            );
        }
        return updated;
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

            const newVerificationRequest = new this.VerificationRequestModel(
                verificationRequest
            );

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

    async count({ contentFilters, topics }): Promise<number> {
        const query: any = {};

        if (contentFilters && contentFilters.length > 0) {
            query.$or = contentFilters.map((filter) => ({
                content: { $regex: filter, $options: "i" },
            }));
        }

        if (topics && topics.length > 0) {
            query["topics.label"] = { $in: topics };
        }

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
}
