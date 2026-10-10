import type { ISentenceService } from "../../../interfaces/sentence.service.interface";
import { Provider } from "@nestjs/common";
import { MongoSentenceService } from "./mongo/sentence.service";
import { PostgresSentenceService } from "./postgres/sentence.service";
import { createDbServiceProvider } from "../../../database/db-service.provider";

export const sentenceServiceProvider: Provider =
    createDbServiceProvider<ISentenceService>(
        "SentenceService",
        MongoSentenceService,
        PostgresSentenceService
    );
