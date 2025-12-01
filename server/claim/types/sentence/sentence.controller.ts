import { Controller, Param, Put, Body, Get } from "@nestjs/common";
import { SentenceService } from "./sentence.service";
import { ApiTags } from "@nestjs/swagger";
import { IsPublic } from "../../../auth/decorators/is-public.decorator";

@Controller()
export class SentenceController {
    constructor(private sentenceService: SentenceService) {}

    @ApiTags("claim")
    @IsPublic()
    @Get("api/sentence/:data_hash")
    getSentenceByHash(@Param("data_hash") data_hash) {
        return this.sentenceService.getByDataHash(data_hash);
    }

    @ApiTags("claim")
    @Put("api/sentence/:data_hash")
    update(@Param("data_hash") data_hash, @Body() topics) {
        return this.sentenceService.updateSentenceWithTopics(topics, data_hash);
    }
}
