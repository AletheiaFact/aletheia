import { Controller, Param, Put, Body } from "@nestjs/common";
import { SentenceService } from "./sentence.service";

@Controller()
export class SentenceController {
    constructor(private sentenceService: SentenceService) {}

    @Put("api/sentence/:data_hash")
    async update(@Param("data_hash") data_hash, @Body() topics) {
        return this.sentenceService.updateSentenceWithTopics(topics, data_hash);
    }
}
