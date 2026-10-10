import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { ISpeechService } from "../../../../interfaces/speech.service.interface";
import type { ISpeech } from "../../../../interfaces/claim-content.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { speech } from "./schema/speech.schema";
import { toSpeechEntity } from "../../../postgres/content.entity";
import { loadSpeechTree } from "../../../postgres/content-tree";

@Injectable()
export class PostgresSpeechService implements ISpeechService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    async create(speechBody: Record<string, any>): Promise<ISpeech> {
        const [row] = await this.db
            .insert(speech)
            .values({
                contentIds: (speechBody.content ?? []).map(String),
                personalityId: speechBody.personality
                    ? String(speechBody.personality)
                    : null,
                claimRevisionId: String(speechBody.claimRevisionId),
            })
            .returning();
        return toSpeechEntity(row);
    }

    async getSpeech(id: string): Promise<ISpeech | null> {
        const [row] = await this.db
            .select()
            .from(speech)
            .where(eq(speech.id, id))
            .limit(1);
        return row ? loadSpeechTree(this.db, row) : null;
    }
}
