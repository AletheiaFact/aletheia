import { Inject, Injectable } from "@nestjs/common";
import type { ISpeechService } from "../../../../interfaces/speech.service.interface";
import type { ISpeech } from "../../../../interfaces/claim-content.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { NotImplementedError } from "../../../../database/errors";

@Injectable()
export class PostgresSpeechService implements ISpeechService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    create(_speechBody: Record<string, any>): Promise<ISpeech> {
        throw new NotImplementedError("postgres", "create");
    }

    getSpeech(_id: string): Promise<ISpeech | null> {
        throw new NotImplementedError("postgres", "getSpeech");
    }
}
