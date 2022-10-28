import { Controller, Param, Put, Body } from "@nestjs/common";
import { SentenceService } from "./sentence.service";

@Controller()
export class SentenceController {
    constructor(private sentenceService: SentenceService) {}

    @Put("api/sentence/:sentence_hash")
    async update(@Param("sentence_hash") sentence_hash, @Body() topics) {
        return this.sentenceService.updateSentenceWithTopics(
            topics,
            sentence_hash
        );
    }
}
