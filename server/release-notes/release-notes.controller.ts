import { Controller, Get, Header, Param, Query, Req, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { ReleaseNotesService } from "./release-notes.service";
import { Public } from "../auth/decorators/auth.decorator";
import { parse } from "url";
import { ViewService } from "../view/view.service";

@Controller(":namespace?")
export class ReleaseNotesController {
    constructor(
        private readonly releaseNotesService: ReleaseNotesService,
        private readonly viewService: ViewService
    ) {}

    @ApiTags("pages")
    @Get("release-notes")
    @Public()
    public async showReleaseNotesPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        await this.viewService.render(req, res, "/release-notes-page", parsedUrl.query);
    }

    @Public()
    @ApiOperation({ summary: "Get latest GitHub releases" })
    @Get("api/release-notes")
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Number of releases to fetch (default: 10)",
    })
    async getLatestReleases(@Query("limit") limit?: string) {
        console.log('first on the first')
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.releaseNotesService.getLatestReleases(limitNumber);
    }

    @Public()
    @Get(":tag")
    @ApiOperation({ summary: "Get a specific GitHub release by tag" })
    @ApiParam({
        name: "tag",
        type: String,
        description: "Release tag (e.g., v1.0.0)",
    })
    async getReleaseByTag(@Param("tag") tag: string) {
        return this.releaseNotesService.getReleaseByTag(tag);
    }
}
