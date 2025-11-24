import { Controller, Param, Put, Body, Get } from "@nestjs/common";
import { SentenceService } from "./sentence.service";
import { ApiTags } from "@nestjs/swagger";
import type { Cop30Sentence } from "../../../../src/types/Cop30Sentence";
import type { Cop30Stats } from "../../../../src/types/Cop30Stats";
import { Auth } from "../../../auth/decorators/auth.decorator";

@Controller()
export class SentenceController {
    constructor(private sentenceService: SentenceService) {}

    @ApiTags("claim")
    @Auth({ public: true })
    @Get("api/sentence/:data_hash")
    getSentenceByHash(@Param("data_hash") data_hash) {
        return this.sentenceService.getByDataHash(data_hash);
    }

    @Auth({ public: true })
    @ApiTags("claim")
    @Get("api/sentences/cop30")
    async getAllSentencesWithCop30Topic(): Promise<Cop30Sentence[]> {
        return this.sentenceService.getSentencesByTopic();
    }

    @Auth({ public: true })
    @ApiTags("claim")
    @Get("api/sentences/cop30/stats")
    async getCop30Stats(): Promise<Cop30Stats> {
        return this.sentenceService.getCop30Stats();
    }

    @ApiTags("claim")
    @Put("api/sentence/:data_hash")
    update(@Param("data_hash") data_hash, @Body() topics) {
        return this.sentenceService.updateSentenceWithTopics(topics, data_hash);
    }
}
