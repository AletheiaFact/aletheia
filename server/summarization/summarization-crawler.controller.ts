import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SummarizationCrawlerService } from "./summarization-crawler.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import type { BaseRequest } from "../types";

@Controller()
export class SummarizationCrawlerController {
    constructor(
        private summarizationCrawlerService: SummarizationCrawlerService
    ) {}

    @ApiTags("source")
    @IsPublic()
    @Get("api/summarization")
    create(@Req() req: BaseRequest, @Query() query) {
        return this.summarizationCrawlerService.summarizePage(
            query.source,
            req.language
        );
    }
}
