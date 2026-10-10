import type { ISpeechService } from "../../../interfaces/speech.service.interface";
import type { MongoSpeechService } from "./mongo/speech.service";
import type { PostgresSpeechService } from "./postgres/speech.service";
import type { ExactlyImplements } from "../../../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoSpeechService,
    ISpeechService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresSpeechService,
    ISpeechService
> = true;
