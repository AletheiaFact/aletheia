import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SummarizationService } from "./summarization.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import type { BaseRequest } from "../types";

@Controller()
export class SummarizationController {
    constructor(private summarizationService: SummarizationService) {}

    @ApiTags("source")
    @IsPublic()
    @Get("api/summarization")
    create(@Req() req: BaseRequest, @Query() query) {
        return this.summarizationService.summarizePage(
            query.source,
            req.language
        );
    }
}
