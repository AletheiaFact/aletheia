import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SummarizationCrawlerService } from "./summarization-crawler.service";
import type { BaseRequest } from "../types";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    CheckAbilities,
    FactCheckerUserAbility,
} from "../auth/ability/ability.decorator";

@Controller()
export class SummarizationCrawlerController {
    constructor(
        private summarizationCrawlerService: SummarizationCrawlerService
    ) {}

    @ApiTags("source")
    @Get("api/summarization")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new FactCheckerUserAbility())
    create(@Req() req: BaseRequest, @Query() query) {
        return this.summarizationCrawlerService.summarizePage(
            query.source,
            req.language
        );
    }
}
