import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Group, GroupDocument } from "./schemas/group.schema";

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name)
        private GroupModel: Model<GroupDocument>
    ) {}

    /**
     * gets the group document by an ID
     * @param groupId group id typeof string
     * @returns
     */
    async getById(groupId: string): Promise<GroupDocument> {
        return this.GroupModel.findById(groupId);
    }

    /**
     * gets the group by querying the content ID
     * @param contentId content id string
     * @returns the group document
     */
    async getByContentId(contentId): Promise<GroupDocument> {
        return this.GroupModel.findOne({ content: contentId }).populate(
            "content"
        );
    }

    /**
     * Creates or updates a group document
     * @param group Group document data
     * @returns the group document
     */
    async create(group: Partial<Group>): Promise<GroupDocument> {
        try {
            const existingGroup = await this.GroupModel.findOne({
                content: { $in: group.content },
            });

            if (existingGroup) {
                return await this.GroupModel.findByIdAndUpdate(
                    existingGroup._id,
                    group,
                    { new: true }
                );
            }

            return await new this.GroupModel(group).save();
        } catch (error) {
            console.error("Failed to create or update group:", error);
            throw error;
        }
    }

    /**
     * Updates the group document with the claim target ID
     * @param groupId specific group which will be updated
     * @param targetId claim target id
     * @returns the group document updated
     */
    async updateWithTargetId(
        groupId: string,
        targetId: string
    ): Promise<GroupDocument> {
        const group = await this.GroupModel.findById(groupId);

        return this.GroupModel.findByIdAndUpdate(
            group._id,
            { targetId: new Types.ObjectId(targetId) },
            { new: true }
        );
    }

    /**
     * Removes a verification request from content group.
     * In case the content is an empty array, deletes the group document
     * @param groupId group id
     * @param contentId verification request id
     * @returns the updated or deleted group document
     */
    async removeContent(
        groupId: string,
        contentId: string
    ): Promise<
        | GroupDocument
        | ({ ok?: number; n?: number } & { deletedCount?: number })
    > {
        try {
            const group = await this.GroupModel.findById(groupId);
            const newContent = group.content.filter(
                (content: any) => content.toString() !== contentId.toString()
            );

            if (!newContent.length) {
                return await this.GroupModel.deleteOne({ _id: group._id });
            }

            if (group) {
                return await this.GroupModel.findByIdAndUpdate(
                    group._id,
                    { content: newContent },
                    { new: true }
                );
            }
        } catch (error) {
            console.error("Failed to remove content:", error);
            throw error;
        }
    }
}
