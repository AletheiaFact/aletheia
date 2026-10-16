import type { ISpeechService } from "../../../interfaces/speech.service.interface";
import { Provider } from "@nestjs/common";
import { MongoSpeechService } from "./mongo/speech.service";
import { PostgresSpeechService } from "./postgres/speech.service";
import { createDbServiceProvider } from "../../../database/db-service.provider";

export const speechServiceProvider: Provider =
    createDbServiceProvider<ISpeechService>(
        "SpeechService",
        MongoSpeechService,
        PostgresSpeechService
    );
