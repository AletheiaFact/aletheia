import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type {
    BadgeCreateInput,
    BadgeUpdateInput,
    IBadgeService,
} from "../../interfaces/badge.service.interface";
import { IBadge } from "../../interfaces/badge.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { badge } from "./schema/badge.schema";
import type { BadgeRow } from "./schema/badge.schema";

@Injectable()
export class PostgresBadgeService implements IBadgeService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    private toEntity(row: BadgeRow): IBadge {
        return { ...row, _id: row.id, image: row.imageId };
    }

    async create(input: BadgeCreateInput): Promise<IBadge> {
        const [row] = await this.db
            .insert(badge)
            .values({
                name: input.name,
                description: input.description,
                imageId: String(input.image._id),
            })
            .returning();
        return this.toEntity(row);
    }

    async update(input: BadgeUpdateInput): Promise<IBadge | null> {
        const [row] = await this.db
            .update(badge)
            .set({
                name: input.name,
                description: input.description,
                imageId: String(input.image._id),
                updatedAt: new Date(),
            })
            .where(eq(badge.id, String(input._id)))
            .returning();
        return row ? this.toEntity(row) : null;
    }

    async listAll(): Promise<IBadge[]> {
        throw new NotImplementedError(
            "postgres",
            "listAll(users and image lookups wait for Phases 4 and 2)"
        );
    }

    async getById(badgeId: string): Promise<IBadge | null> {
        const [row] = await this.db
            .select()
            .from(badge)
            .where(eq(badge.id, badgeId))
            .limit(1);
        return row ? this.toEntity(row) : null;
    }
}
