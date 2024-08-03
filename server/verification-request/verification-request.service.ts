import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { SourceService } from "../source/source.service";
import {
    VerificationRequest,
    VerificationRequestDocument,
} from "./schemas/verification-request.schema";
import { InjectModel } from "@nestjs/mongoose";
import { GroupService } from "../group/group.service";
import { CreateVerificationRequestDTO } from "./dto/create-verification-request-dto";
import { UpdateVerificationRequestDTO } from "./dto/update-verification-request.dto";
import { OpenAIEmbeddings } from "@langchain/openai";
const md5 = require("md5");

@Injectable()
export class VerificationRequestService {
    constructor(
        @InjectModel(VerificationRequest.name)
        private VerificationRequestModel: Model<VerificationRequestDocument>,
        private sourceService: SourceService,
        private groupService: GroupService
    ) {}

    async listAll({
        content,
        page,
        pageSize,
        order,
    }): Promise<VerificationRequest[]> {
        const query: any = {};
        if (content) {
            query.content = { $regex: content, $options: "i" };
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
    async create(
        verificationRequest: CreateVerificationRequestDTO
    ): Promise<VerificationRequestDocument> {
        try {
            verificationRequest.data_hash = md5(verificationRequest.content);
            verificationRequest.embedding = await this.createEmbedContent(
                verificationRequest.content
            );
            const newVerificationRequest = new this.VerificationRequestModel(
                verificationRequest
            );

            if (
                verificationRequest.source &&
                verificationRequest.source.trim() !== ""
            ) {
                const newSource = await this.sourceService.create({
                    href: verificationRequest.source,
                    targetId: newVerificationRequest.id,
                });
                newVerificationRequest.source = Types.ObjectId(newSource.id);
            } else {
                newVerificationRequest.source = null;
            }

            return newVerificationRequest.save();
        } catch (e) {
            console.error("Failed to create verification request", e);
            throw new Error(e);
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
                .populate("source");
        }

        return this.VerificationRequestModel.findOne({ data_hash }).populate(
            "source"
        );
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

    count(query) {
        return this.VerificationRequestModel.countDocuments().where(query);
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
     * @param content verification request content
     * @param filter verification requests IDs to filter, does not recommend verification requests those are part of the same group
     * @param pageSize limit of documents
     * @returns Verification requests with the similarity score greater than 0.80
     */
    async findSimilarRequests(
        content,
        filter,
        pageSize
    ): Promise<VerificationRequest[]> {
        const queryEmbedding = await this.createEmbedContent(content);
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
