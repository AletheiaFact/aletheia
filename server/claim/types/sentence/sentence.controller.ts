import { Controller, Param, Put, Body, Get, Inject } from "@nestjs/common";
import type { ISentenceService } from "../../../interfaces/sentence.service.interface";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "../../../auth/decorators/auth.decorator";

@Controller()
export class SentenceController {
    constructor(
        @Inject("SentenceService") private sentenceService: ISentenceService
    ) {}

    @ApiTags("claim")
    @Auth({ public: true })
    @Get("api/sentence/:data_hash")
    getSentenceByHash(@Param("data_hash") data_hash: string) {
        return this.sentenceService.getByDataHash(data_hash);
    }

    @ApiTags("claim")
    @Put("api/sentence/:data_hash")
    update(@Param("data_hash") data_hash: string, @Body() topics: any[]) {
        return this.sentenceService.updateSentenceWithTopics(topics, data_hash);
    }
}
