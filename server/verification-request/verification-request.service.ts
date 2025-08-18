import { BadRequestException, Injectable } from "@nestjs/common";
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
import { AiTaskService } from "../ai-task/ai-task.service";
import { CreateAiTaskDto } from "../ai-task/dto/create-ai-task.dto";
import {
    AiTaskType,
    CallbackRoute,
} from "../ai-task/constants/ai-task.constants";
const md5 = require("md5");

@Injectable()
export class VerificationRequestService {
    constructor(
        @InjectModel(VerificationRequest.name)
        private VerificationRequestModel: Model<VerificationRequestDocument>,
        private sourceService: SourceService,
        private groupService: GroupService,
        private readonly aiTaskService: AiTaskService
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

        const taskDto: CreateAiTaskDto = {
            type: AiTaskType.TextEmbedding,
            content: data.content,
            callbackRoute: CallbackRoute.VerificationUpdateEmbedding,
            callbackParams: {
                targetId: vr.id,
                field: "embedding",
            },
        };
        await this.aiTaskService.create(taskDto);

        return vr;
    }

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
                .populate("source");
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

            const updatedVerificationRequestData = {
                ...verificationRequest.toObject(),
                ...verificationRequestBodyUpdate,
            };

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

            return await this.VerificationRequestModel.findByIdAndUpdate(
                verificationRequest._id,
                updatedVerificationRequestData,
                { new: true, upsert: true }
            );
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
                $unwind: {
                    path: "$source",
                    preserveNullAndEmptyArrays: true,
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

        const newVerificationRequest = {
            ...verificationRequest.toObject(),
            topics,
        };
        return this.VerificationRequestModel.updateOne(
            { _id: verificationRequest._id },
            newVerificationRequest
        );
    }
}
