import { Inject, Injectable } from "@nestjs/common";
import type {
    ISentenceService,
    SentenceFindAllOptions,
} from "../../../../interfaces/sentence.service.interface";
import type { ISentence } from "../../../../interfaces/claim-content.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { NotImplementedError } from "../../../../database/errors";

@Injectable()
export class PostgresSentenceService implements ISentenceService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    create(_sentenceBody: Record<string, any>): Promise<any> {
        throw new NotImplementedError("postgres", "create");
    }

    getByDataHash(_data_hash: string): Promise<ISentence> {
        throw new NotImplementedError("postgres", "getByDataHash");
    }

    updateSentenceWithTopics(
        _topics: any[],
        _data_hash: string
    ): Promise<ISentence | null> {
        throw new NotImplementedError("postgres", "updateSentenceWithTopics");
    }

    findAll(
        _options: SentenceFindAllOptions
    ): Promise<{ totalRows: number; processedSentences: any[] }> {
        throw new NotImplementedError("postgres", "findAll");
    }

    getHashesByTopic(_topicId: string): Promise<string[]> {
        throw new NotImplementedError("postgres", "getHashesByTopic");
    }
}
