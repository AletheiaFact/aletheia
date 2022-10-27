import { Controller, Get, Header, Req, Res } from "@nestjs/common";
import { ViewService } from "../view/view.service";
import { Response } from "express";
import { parse } from "url";
import { PersonalityService } from "../personality/personality.service";
import { StatsService } from "../stats/stats.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { BaseRequest } from "../types";

@Controller("/")
export class HomeController {
    constructor(
        private viewService: ViewService,
        private personalityService: PersonalityService,
        private statsService: StatsService
    ) {}

    @Get("/home")
    /**
     * Redirect /home to / for backwards compatibility
     * @param res
     */
    redirect(@Res() res) {
        return res.redirect("/");
    }

    @IsPublic()
    @Get()
    @Header("Cache-Control", "max-age=3600")
    public async showHome(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        const { personalities } = await this.personalityService.combinedListAll(
            {
                language: req.language,
                order: "random",
                pageSize: 6,
                fetchOnly: true,
            }
        );

        const stats = await this.statsService.getHomeStats();
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/home-page",
                Object.assign(parsedUrl.query, { personalities, stats })
            );
    }
}
