import {
    Controller,
    Get,
    Header,
    Inject,
    NotFoundException,
    Req,
    Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { parse } from "url";
import { ApiTags } from "@nestjs/swagger";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import type { IClaimService } from "../interfaces/claim.service.interface";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { ViewService } from "../view/view.service";
import { TargetModel } from "../history/schema/history.schema";
import { Public } from "../auth/decorators/auth.decorator";

@Controller(":namespace?")
export class ClaimSourcesHistoryPageController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private reviewTaskService: ReviewTaskService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        @Inject("ClaimService") private claimService: IClaimService,
        private viewService: ViewService
    ) {}

    @Public()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/sources")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async sourcesClaimPage(@Req() req: Request, @Res() res: Response) {
        const { personalitySlug, claimSlug, namespace } = req.params;
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getPersonalityBySlug({
            slug: personalitySlug,
            isDeleted: false,
        });

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            undefined,
            false
        );

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: claim._id,
            nameSpace: namespace,
        });

        await this.viewService.render(
            req,
            res,
            "/claim-sources-page",
            queryObject
        );
    }

    @Public()
    @ApiTags("pages")
    @Get(
        "personality/:personalitySlug/claim/:claimSlug/sentence/:data_hash/sources"
    )
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async sourcesReportPage(@Req() req: Request, @Res() res: Response) {
        const { data_hash, personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getPersonalityBySlug({
            slug: personalitySlug,
            isDeleted: false,
        });

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            undefined,
            false
        );

        const report = await this.claimReviewService.getReport({
            personality: personality._id,
            claim: claim._id,
            data_hash,
        });

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: report?._id,
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(
            req,
            res,
            "/claim-sources-page",
            queryObject
        );
    }

    @ApiTags("pages")
    @Get("claim/:claimSlug/history")
    public async claimWithoutPersonalityHistoryPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { claimSlug, namespace } = req.params;
        const parsedUrl = parse(req.url, true);

        const claim = await this.claimService.getByClaimSlug(claimSlug);

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: claim._id,
            targetModel: TargetModel.Claim,
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/history-page", queryObject);
    }

    @Public()
    @ApiTags("pages")
    @Get("claim/:claimSlug/sources")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async claimWithoutPersonalitySourcesPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { claimSlug, namespace } = req.params;
        const parsedUrl = parse(req.url, true);

        const claim = await this.claimService.getByClaimSlug(
            claimSlug,
            undefined,
            false
        );

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: claim._id,
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/sources-page", queryObject);
    }

    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/history")
    public async ClaimHistoryPage(@Req() req: Request, @Res() res: Response) {
        const { personalitySlug, claimSlug, namespace } = req.params;
        const parsedUrl = parse(req.url, true);

        const personality =
            await this.personalityService.getClaimsByPersonalitySlug({
                slug: personalitySlug,
                isDeleted: false,
            });

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug
        );

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: claim._id,
            targetModel: TargetModel.Claim,
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/history-page", queryObject);
    }

    @ApiTags("pages")
    @Get(
        "personality/:personalitySlug/claim/:claimSlug/sentence/:data_hash/history"
    )
    public async ClaimReviewHistoryPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { data_hash } = req.params;
        const parsedUrl = parse(req.url, true);

        const reviewTask = await this.reviewTaskService.getReviewTaskByDataHash(
            data_hash
        );
        if (!reviewTask) {
            throw new NotFoundException();
        }

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: reviewTask._id,
            targetModel: TargetModel.ReviewTask,
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/history-page", queryObject);
    }
}
