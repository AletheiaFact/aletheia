import type { IGroup } from "./group.interface";

export type GroupCreateInput = { content: any[]; targetId?: any };

export type IGroupService = {
    getById(groupId: string): Promise<IGroup | null>;
    getByContentId(contentId: string): Promise<IGroup | null>;
    create(group: GroupCreateInput): Promise<IGroup>;
    updateWithTargetId(
        groupId: string,
        targetId: string
    ): Promise<IGroup | null>;
    removeContent(
        groupId: string,
        contentId: string
    ): Promise<IGroup | { deletedCount?: number } | undefined>;
};
