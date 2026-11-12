import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
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
                isDraft: speechBody.isDraft === true,
            })
            .returning();
        return toSpeechEntity(row);
    }

    async getSpeech(id: string): Promise<ISpeech | null> {
        // Draft debate transcript speeches are not public until approved.
        const [row] = await this.db
            .select()
            .from(speech)
            .where(and(eq(speech.id, id), eq(speech.isDraft, false)))
            .limit(1);
        return row ? loadSpeechTree(this.db, row) : null;
    }
}
