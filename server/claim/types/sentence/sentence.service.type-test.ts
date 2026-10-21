import type { ISentenceService } from "../../../interfaces/sentence.service.interface";
import type { MongoSentenceService } from "./mongo/sentence.service";
import type { PostgresSentenceService } from "./postgres/sentence.service";
import type { ExactlyImplements } from "../../../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoSentenceService,
    ISentenceService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresSentenceService,
    ISentenceService
> = true;
