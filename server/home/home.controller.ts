import { Controller, Get, Header, Req, Res } from "@nestjs/common";
import { ViewService } from "../view/view.service";
import { Response } from "express";
import { parse } from "url";
import { PersonalityService } from "../personality/personality.service";
import { StatsService } from "../stats/stats.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { BaseRequest } from "../types";
import { DebateService } from "../claim/types/debate/debate.service";
import { ClaimRevisionService } from "../claim/claim-revision/claim-revision.service";

@Controller("/")
export class HomeController {
    constructor(
        private viewService: ViewService,
        private personalityService: PersonalityService,
        private statsService: StatsService,
        private debateService: DebateService,
        private claimRevisionService: ClaimRevisionService
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
    @Header("Cache-Control", "max-age=60, must-revalidate")
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

        const liveDebates = await this.debateService.listAll(0, 6, "asc", {
            isLive: true,
        });

        const claims = await Promise.all(
            liveDebates.map(async (debate) => {
                const debateRevision =
                    await this.claimRevisionService.getByContentId(debate._id);
                const personalities = await Promise.all(
                    debateRevision.personalities.map((personality) => {
                        if (personality) {
                            return this.personalityService.getById(
                                personality,
                                req.language
                            );
                        }
                    })
                );
                return {
                    title: debateRevision.title,
                    claimId: debateRevision.claimId,
                    personalities,
                };
            })
        );

        const stats = await this.statsService.getHomeStats();
        await this.viewService.getNextServer().render(
            req,
            res,
            "/home-page",
            Object.assign(parsedUrl.query, {
                personalities,
                stats,
                claims,
            })
        );
    }
}
