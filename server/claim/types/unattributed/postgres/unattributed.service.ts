import { Inject, Injectable } from "@nestjs/common";
import type { IUnattributedService } from "../../../../interfaces/unattributed.service.interface";
import type { IUnattributed } from "../../../../interfaces/claim-content.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { unattributed } from "./schema/unattributed.schema";
import { toUnattributedEntity } from "../../../postgres/content.entity";

@Injectable()
export class PostgresUnattributedService implements IUnattributedService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    async create(
        unattributedBody: Record<string, any>
    ): Promise<IUnattributed> {
        const [row] = await this.db
            .insert(unattributed)
            .values({
                contentIds: (unattributedBody.content ?? []).map(String),
            })
            .returning();
        return toUnattributedEntity(row);
    }
}
