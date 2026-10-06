import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { arrayOverlaps, eq, inArray, sql } from "drizzle-orm";
import type {
    GroupCreateInput,
    IGroupService,
} from "../../interfaces/group.service.interface";
import { IGroup } from "../../interfaces/group.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { contentGroup } from "./schema/group.schema";
import type { ContentGroupRow } from "./schema/group.schema";
import { verificationRequest } from "../../verification-request/postgres/schema/verification-request.schema";

@Injectable()
export class PostgresGroupService implements IGroupService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    private toEntity(
        row: ContentGroupRow,
        content: any[] = row.contentIds
    ): IGroup {
        return {
            ...row,
            _id: row.id,
            content,
            targetId: row.targetId ?? undefined,
        };
    }

    private async findRow(groupId: string): Promise<ContentGroupRow | null> {
        const [row] = await this.db
            .select()
            .from(contentGroup)
            .where(eq(contentGroup.id, groupId))
            .limit(1);
        return row ?? null;
    }

    async getById(groupId: string): Promise<IGroup | null> {
        const row = await this.findRow(groupId);
        return row ? this.toEntity(row) : null;
    }

    async getByContentId(contentId: string): Promise<IGroup | null> {
        const [row] = await this.db
            .select()
            .from(contentGroup)
            .where(
                sql`${contentGroup.contentIds} @> ARRAY[${contentId}]::uuid[]`
            )
            .orderBy(contentGroup.createdAt, contentGroup.id)
            .limit(1);
        if (!row) return null;
        const rows = row.contentIds.length
            ? await this.db
                  .select()
                  .from(verificationRequest)
                  .where(inArray(verificationRequest.id, row.contentIds))
            : [];
        const byId = new Map(rows.map((r) => [r.id, { ...r, _id: r.id }]));
        const content = row.contentIds
            .map((id) => byId.get(id))
            .filter(Boolean);
        return this.toEntity(row, content);
    }

    async create(group: GroupCreateInput): Promise<IGroup> {
        const contentIds = (group.content ?? []).map(String);
        const patch = {
            contentIds,
            ...(group.targetId !== undefined
                ? { targetId: group.targetId ? String(group.targetId) : null }
                : {}),
        };
        const [existing] = contentIds.length
            ? await this.db
                  .select()
                  .from(contentGroup)
                  .where(arrayOverlaps(contentGroup.contentIds, contentIds))
                  .orderBy(contentGroup.createdAt, contentGroup.id)
                  .limit(1)
            : [];
        if (existing) {
            const [updated] = await this.db
                .update(contentGroup)
                .set({ ...patch, updatedAt: new Date() })
                .where(eq(contentGroup.id, existing.id))
                .returning();
            if (!updated) {
                throw new NotFoundException(`Group not found: ${existing.id}`);
            }
            return this.toEntity(updated);
        }
        const [row] = await this.db
            .insert(contentGroup)
            .values(patch)
            .returning();
        return this.toEntity(row);
    }

    async updateWithTargetId(
        groupId: string,
        targetId: string
    ): Promise<IGroup | null> {
        const group = await this.findRow(groupId);
        if (!group) return null;
        const [row] = await this.db
            .update(contentGroup)
            .set({ targetId: String(targetId), updatedAt: new Date() })
            .where(eq(contentGroup.id, group.id))
            .returning();
        return this.toEntity(row);
    }

    async removeContent(
        groupId: string,
        contentId: string
    ): Promise<IGroup | { deletedCount?: number } | undefined> {
        const group = await this.findRow(groupId);
        if (!group) return undefined;
        const newContent = group.contentIds.filter(
            (id) => id !== String(contentId)
        );
        if (!newContent.length) {
            const deleted = await this.db
                .delete(contentGroup)
                .where(eq(contentGroup.id, group.id))
                .returning({ id: contentGroup.id });
            return { deletedCount: deleted.length };
        }
        const [row] = await this.db
            .update(contentGroup)
            .set({ contentIds: newContent, updatedAt: new Date() })
            .where(eq(contentGroup.id, group.id))
            .returning();
        return row ? this.toEntity(row) : undefined;
    }
}
