import { Controller, Put, Get, Inject } from "@nestjs/common";
import type { ISentenceService } from "../../../interfaces/sentence.service.interface";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "../../../auth/decorators/auth.decorator";
import { ZodBody, ZodParam } from "../../../common/validation";
import { dataHash } from "../../../../lib/schemas";
import { SentenceTopicsSchema } from "../../dto/claim.dto";
import type { SentenceTopicsDto } from "../../dto/claim.dto";

@Controller()
export class SentenceController {
    constructor(
        @Inject("SentenceService") private sentenceService: ISentenceService
    ) {}

    @ApiTags("claim")
    @Auth({ public: true })
    @Get("api/sentence/:data_hash")
    getSentenceByHash(@ZodParam("data_hash", dataHash) data_hash: string) {
        return this.sentenceService.getByDataHash(data_hash);
    }

    @ApiTags("claim")
    @Put("api/sentence/:data_hash")
    update(
        @ZodParam("data_hash", dataHash) data_hash: string,
        @ZodBody(SentenceTopicsSchema) topics: SentenceTopicsDto
    ) {
        return this.sentenceService.updateSentenceWithTopics(topics, data_hash);
    }
}
