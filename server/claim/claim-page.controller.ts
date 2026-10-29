import {
    Controller,
    Get,
    Header,
    Inject,
    Redirect,
    Req,
    Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { parse } from "url";
import { ApiTags } from "@nestjs/swagger";
import { ViewService } from "../view/view.service";
import type { IClaimService } from "../interfaces/claim.service.interface";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { IGroupService } from "../interfaces/group.service.interface";
import { CaptchaService } from "../captcha/captcha.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { Public } from "../auth/decorators/auth.decorator";
import { ZodQuery } from "../common/validation";
import { ClaimCreatePageQuerySchema } from "./dto/claim.dto";
import type { ClaimCreatePageQueryDto } from "./dto/claim.dto";
import type { BaseRequest } from "../types";
import { redirectBasedOnPersonality } from "./claim-page.utils";

@Controller(":namespace?")
export class ClaimPageController {
    constructor(
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        @Inject("ClaimService") private claimService: IClaimService,
        @Inject("GroupService") private groupService: IGroupService,
        private configService: ConfigService,
        private viewService: ViewService,
        private captchaService: CaptchaService,
        private featureFlagService: FeatureFlagService,
        private historyService: HistoryService
    ) {}

    @ApiTags("pages")
    @Get("claim/create")
    public async claimCreatePage(
        @ZodQuery(ClaimCreatePageQuerySchema) query: ClaimCreatePageQueryDto,
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const verificationRequestGroup = query.verificationRequest
            ? await this.groupService.getByContentId(query.verificationRequest)
            : null;

        const personality = query.personality
            ? await this.personalityService.getClaimsByPersonalitySlug(
                  {
                      slug: query.personality,
                      isDeleted: false,
                  },
                  req.language
              )
            : null;

        const queryObject = Object.assign(parsedUrl.query, {
            personality,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            nameSpace: req.params.namespace,
            verificationRequestGroup,
        });

        await this.viewService.render(req, res, "/claim-create", queryObject);
    }

    @Public()
    @ApiTags("pages")
    @Get("claim")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async claimsWithoutPersonalityPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(
            req,
            res,
            "/claim-list-page",
            queryObject
        );
    }

    @Public()
    @Redirect()
    @ApiTags("pages")
    @Get("claim/:claimSlug")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async imageClaimPage(@Req() req: BaseRequest, @Res() res: Response) {
        const { claimSlug, namespace = NameSpaceEnum.Main } = req.params;
        const parsedUrl = parse(req.url, true);
        const claim = await this.claimService.getByClaimSlug(claimSlug);
        const enableCollaborativeEditor =
            this.featureFlagService.isEnableCollaborativeEditor();
        const enableCopilotChatBot =
            this.featureFlagService.isEnableCopilotChatBot();
        const enableEditorAnnotations =
            this.featureFlagService.isEnableEditorAnnotations();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        redirectBasedOnPersonality(res, claim, namespace);

        const queryObject = Object.assign(parsedUrl.query, {
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/claim-page", queryObject);
    }

    @ApiTags("pages")
    @Get("claim/:claimSlug/revision/:revisionId")
    public async ClaimPageWithRevision(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { claimSlug, revisionId, namespace } = req.params;
        const parsedUrl = parse(req.url, true);

        const enableCollaborativeEditor =
            this.featureFlagService.isEnableCollaborativeEditor();
        const enableCopilotChatBot =
            this.featureFlagService.isEnableCopilotChatBot();
        const enableEditorAnnotations =
            this.featureFlagService.isEnableEditorAnnotations();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        const claim = await this.claimService.getByClaimSlug(
            claimSlug,
            revisionId
        );

        const queryObject = Object.assign(parsedUrl.query, {
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot: enableCopilotChatBot,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/claim-page", queryObject);
    }

    @Public()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async personalityClaimPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const hideDescriptions: any = {};
        const { personalitySlug, claimSlug, namespace } = req.params;
        const parsedUrl = parse(req.url, true);

        const enableCollaborativeEditor =
            this.featureFlagService.isEnableCollaborativeEditor();
        const enableCopilotChatBot =
            this.featureFlagService.isEnableCopilotChatBot();
        const enableEditorAnnotations =
            this.featureFlagService.isEnableEditorAnnotations();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        const personality =
            await this.personalityService.getClaimsByPersonalitySlug(
                {
                    slug: personalitySlug,
                    isDeleted: false,
                },
                req.language
            );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug
        );

        hideDescriptions[TargetModel.Claim] =
            await this.historyService.getDescriptionForHide(
                claim,
                TargetModel.Claim
            );

        const queryObject = Object.assign(parsedUrl.query, {
            personality,
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            hideDescriptions,
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/claim-page", queryObject);
    }

    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/revision/:revisionId")
    public async personalityClaimPageWithRevision(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { personalitySlug, claimSlug, revisionId, namespace } =
            req.params;
        const parsedUrl = parse(req.url, true);
        const personality =
            await this.personalityService.getClaimsByPersonalitySlug(
                {
                    slug: personalitySlug,
                    isDeleted: false,
                },
                req.language
            );

        const enableCollaborativeEditor =
            this.featureFlagService.isEnableCollaborativeEditor();
        const enableCopilotChatBot =
            this.featureFlagService.isEnableCopilotChatBot();
        const enableEditorAnnotations =
            this.featureFlagService.isEnableEditorAnnotations();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            revisionId
        );

        const queryObject = Object.assign(parsedUrl.query, {
            personality,
            claim,
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot: enableCopilotChatBot,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/claim-page", queryObject);
    }
}
