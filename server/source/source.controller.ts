import {
    Body,
    Controller,
    Get,
    Header,
    Logger,
    Optional,
    Param,
    Post,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { SourceService } from "./source.service";
import { ApiTags } from "@nestjs/swagger";
import type { BaseRequest } from "../types";
import { parse } from "url";
import { ViewService } from "../view/view.service";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { CreateSourceDTO } from "./dto/create-source.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { UnleashService } from "nestjs-unleash";
import { TargetModel } from "../history/schema/history.schema";
import { HistoryService } from "../history/history.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";

@Controller(":namespace?")
export class SourceController {
    private readonly logger = new Logger("SourceController");
    constructor(
        private sourceService: SourceService,
        private viewService: ViewService,
        private configService: ConfigService,
        private captchaService: CaptchaService,
        private claimReviewService: ClaimReviewService,
        private reviewTaskService: ReviewTaskService,
        private historyService: HistoryService,
        private featureFlagService: FeatureFlagService,
        @Optional() private readonly unleash: UnleashService
    ) {}

    @ApiTags("source")
    @Get("api/source/:id")
    async getById(@Param("id") sourceId: string) {
        return this.sourceService.getById(sourceId);
    }

    @ApiTags("source")
    @Get("api/source/target/:targetId")
    public async getSourcesByTargetId(
        @Param() params,
        @Query() getSources: any
    ) {
        const { targetId } = params;
        const { page, order } = getSources;
        const pageSize = parseInt(getSources.pageSize, 10);
        return this.sourceService
            .getByTargetId(targetId, page, pageSize, order)
            .then((sources) => {
                const totalSources = sources.length;
                const totalPages = Math.ceil(totalSources / pageSize);
                this.logger.log(
                    `Found ${totalSources} sources for targetId ${targetId}. Page ${page} of ${totalPages}`
                );
                return { sources, totalSources, totalPages, page, pageSize };
            })
            .catch();
    }

    @ApiTags("source")
    @Post("api/source")
    async create(@Body() createSourceDTO: CreateSourceDTO) {
        const validateCaptcha = await this.captchaService.validate(
            createSourceDTO.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }

        return this.sourceService.create(createSourceDTO);
    }

    @ApiTags("pages")
    @Get("source/create")
    public async sourceCreatePage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/sources-create",
            Object.assign(parsedUrl.query, {
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                nameSpace: req.params.namespace,
            })
        );
    }

    @ApiTags("source")
    @Get("/check-source")
    async checkSpurce(@Query() query) {
        try {
            const result = await fetch(query.source, {
                method: "GET",
            });
            if (result.ok) {
                return { status: 200, message: "Valid Source"};
            } else {
                return { status: 404, message: "Invalid Source"};
            }
        } catch (error) {
            return { status: 500, message: "Internal error when source verification"};
        }
     }

    @IsPublic()
    @ApiTags("source")
    @Get("api/source")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(@Query() query) {
        return Promise.all([
            this.sourceService.listAll(query),
            this.sourceService.count({ nameSpace: query.nameSpace }),
        ]).then(([sources, totalSources]) => {
            const totalPages = Math.ceil(totalSources / query.pageSize);

            this.logger.log(
                `Found ${totalSources} sources. Page ${query.page} of ${totalPages}`
            );

            return {
                sources,
                totalSources,
                totalPages,
                page: query.page,
                pageSize: query.pageSize,
            };
        });
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("source")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async sourcesPage(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/sources-page",
            Object.assign(parsedUrl.query, {
                nameSpace: req.params.namespace,
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("source/:dataHash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async sourceReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const source = await this.sourceService.getByDataHash(
            req.params.dataHash
        );

        const reviewTask =
            await this.reviewTaskService.getReviewTaskByDataHashWithUsernames(
                source.data_hash
            );
        const claimReview = await this.claimReviewService.getReviewByDataHash(
            source.data_hash
        );

        const enableCollaborativeEditor =
            this.featureFlagService.isEnableCollaborativeEditor();
        const enableCopilotChatBot =
            this.featureFlagService.isEnableCopilotChatBot();
        const enableEditorAnnotations =
            this.featureFlagService.isEnableEditorAnnotations();
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();
        const hideDescriptions = {};

        hideDescriptions[TargetModel.Source] =
            await this.historyService.getDescriptionForHide(
                source,
                TargetModel.Claim
            );

        hideDescriptions[TargetModel.ClaimReview] =
            await this.historyService.getDescriptionForHide(
                claimReview,
                TargetModel.ClaimReview
            );

        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/source-review",
            Object.assign(parsedUrl.query, {
                source,
                reviewTask,
                claimReview,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                hideDescriptions,
                enableCollaborativeEditor,
                enableEditorAnnotations,
                enableCopilotChatBot,
                enableAddEditorSourcesWithoutSelecting,
                enableReviewersUpdateReport,
                enableViewReportPreview,
                websocketUrl: this.configService.get<string>("websocketUrl"),
                nameSpace: req.params.namespace,
            })
        );
    }
}
