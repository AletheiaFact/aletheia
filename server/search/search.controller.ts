import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ClaimRevisionService } from "../claim-revision/claim-revision.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { PersonalityService } from "../personality/personality.service";
import { SentenceService } from "../sentence/sentence.service";

@Controller()
export class SearchController {
    private readonly logger = new Logger("SearchController");
    constructor(
        private personalityService: PersonalityService,
        private sentenceService: SentenceService,
        private claimRevisionService: ClaimRevisionService
    ) {}

    @IsPublic()
    @Get("api/search")
    async listAll(@Query() query) {
        const { pageSize, searchText, language } = query;

        return Promise.all([
            this.personalityService.findAll(searchText, pageSize, language),
            this.sentenceService.findAll(searchText, pageSize),
            this.claimRevisionService.findAll(searchText, pageSize),
        ])
            .then(([personalities, sentences, claims]) => {
                return {
                    personalities,
                    sentences,
                    claims,
                };
            })
            .catch((error) => this.logger.error(error));
    }
}
