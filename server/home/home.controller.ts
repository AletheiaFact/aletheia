import {
    Controller,
    Get,
    Header,
    Inject,
    Redirect,
    Req,
    Res,
} from "@nestjs/common";
import { ViewService } from "../view/view.service";
import type { Response } from "express";
import { parse } from "url";
import { StatsService } from "../stats/stats.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import type { BaseRequest } from "../types";
import { DebateService } from "../claim/types/debate/debate.service";
import { ClaimRevisionService } from "../claim/claim-revision/claim-revision.service";
import { ApiTags } from "@nestjs/swagger";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

@Controller("/")
export class HomeController {
    constructor(
        private viewService: ViewService,
        @Inject("PersonalityService")
        private personalityService: IPersonalityService,
        private statsService: StatsService,
        private debateService: DebateService,
        private claimRevisionService: ClaimRevisionService,
        private claimReviewService: ClaimReviewService
    ) {}

    @ApiTags("pages")
    @Get("/home/:namespace?")
    @Redirect()
    redirect(@Res() res) {
        return res.redirect("/");
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("/:namespace?")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async showHome(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const reviews = await this.claimReviewService.listAll({
            page: 0,
            pageSize: 6,
            order: "asc",
            query: {
                isHidden: false,
                isDeleted: false,
                nameSpace: req.params.namespace || NameSpaceEnum.Main,
            },
            latest: true,
        });

        const { personalities } = await this.personalityService.combinedListAll(
            {
                language: req.language,
                order: "random",
                pageSize: 6,
                fetchOnly: true,
            }
        );

        //TODO: Get live debates from namespaces
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
                                {
                                    language: req.language,
                                    nameSpace:
                                        req.params.namespace ||
                                        NameSpaceEnum.Main,
                                }
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

        const queryObject = Object.assign(parsedUrl.query, {
            personalities,
            stats,
            claims,
            reviews,
            nameSpace: req.params.namespace || NameSpaceEnum.Main,
        });

        await this.viewService.render(req, res, "/home-page", queryObject);
    }
}
