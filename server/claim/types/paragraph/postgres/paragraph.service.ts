import { Inject, Injectable } from "@nestjs/common";
import type { IParagraphService } from "../../../../interfaces/paragraph.service.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { paragraph } from "./schema/paragraph.schema";

@Injectable()
export class PostgresParagraphService implements IParagraphService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    async create(paragraphBody: Record<string, any>): Promise<any> {
        const sentenceIds: any[] = await Promise.all(paragraphBody.content);
        const [row] = await this.db
            .insert(paragraph)
            .values({
                dataHash: paragraphBody.data_hash,
                props: paragraphBody.props ?? {},
                contentIds: sentenceIds.map(String),
                claimRevisionId: String(paragraphBody.claimRevisionId),
            })
            .returning({ id: paragraph.id });
        return row.id;
    }
}
