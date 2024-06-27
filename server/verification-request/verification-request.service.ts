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
const md5 = require("md5");

@Injectable()
export class VerificationRequestService {
    constructor(
        @InjectModel(VerificationRequest.name)
        private VerificationRequestModel: Model<VerificationRequestDocument>,
        private sourceService: SourceService,
        private groupService: GroupService
    ) {}

    /**
     * Find all verification requests that query matches
     * @param verifiedRequestQuery query parameter
     * @returns an array of verification request documents
     */
    async findAll(verifiedRequestQuery: {
        searchContent: string;
    }): Promise<VerificationRequest[]> {
        return this.VerificationRequestModel.find({
            content: {
                $regex: verifiedRequestQuery.searchContent || "",
                $options: "i",
            },
        });
    }

    /**
     * Finds a document by an id parameter
     * @param verificationRequestId verification request ID string
     * @returns the verification request document
     */
    async getById(verificationRequestId: string): Promise<VerificationRequest> {
        return this.VerificationRequestModel.findById(
            verificationRequestId
        ).populate("group");
    }

    /**
     * Creates a new verification request document
     * For each sources in verification request, creates a new source document
     * @param verificationRequest verificationRequestBody
     * @returns the verification request document
     */
    create(
        verificationRequest: CreateVerificationRequestDTO
    ): Promise<VerificationRequestDocument> {
        try {
            verificationRequest.data_hash = md5(verificationRequest.content);
            const newVerificationRequest = new this.VerificationRequestModel(
                verificationRequest
            );
            if (verificationRequest.sources.length) {
                for (const source of verificationRequest.sources) {
                    this.sourceService.create({
                        href: source,
                        targetId: newVerificationRequest.id,
                    });
                }
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
        data_hash: string
    ): Promise<VerificationRequestDocument> {
        return this.VerificationRequestModel.findOne({ data_hash }).populate(
            "group"
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
}
