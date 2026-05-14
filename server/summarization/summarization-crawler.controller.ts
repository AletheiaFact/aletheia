import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SummarizationCrawlerService } from "./summarization-crawler.service";
import type { BaseRequest } from "../types";
import { FactCheckerOnly } from "../auth/decorators/auth.decorator";

@Controller()
export class SummarizationCrawlerController {
    constructor(
        private summarizationCrawlerService: SummarizationCrawlerService
    ) {}

    @FactCheckerOnly()
    @ApiTags("source")
    @Get("api/summarization")
    create(@Req() req: BaseRequest, @Query() query: { source: string }) {
        return this.summarizationCrawlerService.summarizePage(
            query.source,
            req.language
        );
    }
}
