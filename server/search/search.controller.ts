import { Controller, Get, Logger, Query } from "@nestjs/common";
import { IsPublic } from "../decorators/is-public.decorator";
import { PersonalityService } from "../personality/personality.service";
import { SentenceService } from "../sentence/sentence.service";

@Controller()
export class SearchController {
    private readonly logger = new Logger("SearchController");
    constructor(
        private personalityService: PersonalityService,
        private sentenceService: SentenceService
    ) {}

    @IsPublic()
    @Get("api/search")
    async listAll(@Query() query) {
        const { pageSize, searchText, language } = query;

        return Promise.all([
            this.personalityService.findAll(searchText, pageSize, language),
            this.sentenceService.findAll(searchText, pageSize),
        ])
            .then(([personalities, sentences]) => {
                return {
                    personalities,
                    sentences,
                };
            })
            .catch((error) => this.logger.error(error));
    }
}
