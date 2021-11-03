import {Controller, Get, Req, Res} from "@nestjs/common";
import {ViewService} from "../view/view.service";
import {Request, Response} from "express";
import {parse} from "url";
import {PersonalityService} from "../personality/personality.service";
import {StatsService} from "../stats/stats.service";

@Controller("/")
export class HomeController {
    constructor(
        private viewService: ViewService,
        private personalityService: PersonalityService,
        private statsService: StatsService
    ) {}

    @Get("newhome")
    public async showHome(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";
        const { personalities } = await this.personalityService.combinedListAll({
            // @ts-ignore
            language: req.language,
            pageSize: 5,
            fetchOnly: true
        });
        const stats = await this.statsService.getHomeStats();
        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/newhome",
                Object.assign(parsedUrl.query, { personalities, stats })
            );
    }
}
