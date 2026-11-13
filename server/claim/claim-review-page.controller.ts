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
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import type { IClaimService } from "../interfaces/claim.service.interface";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { ISentenceService } from "../interfaces/sentence.service.interface";
import { ViewService } from "../view/view.service";
import { CaptchaService } from "../captcha/captcha.service";
import { ImageService } from "./types/image/image.service";
import { ImageDocument } from "./types/image/schemas/image.schema";
import { EditorService } from "../editor/editor.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { HistoryService } from "../history/history.service";
import { TargetModel } from "../history/schema/history.schema";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { AdminOnly, Public } from "../auth/decorators/auth.decorator";
import { GetByDataHashDto } from "./dto/get-by-datahash.dto";
import type { BaseRequest } from "../types";
import type { ISentence } from "../interfaces/claim-content.interface";
import { redirectBasedOnPersonality } from "./claim-page.utils";

@Controller(":namespace?")
export class ClaimReviewPageController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private reviewTaskService: ReviewTaskService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        @Inject("ClaimService") private claimService: IClaimService,
        @Inject("SentenceService") private sentenceService: ISentenceService,
        private configService: ConfigService,
        private viewService: ViewService,
        private captchaService: CaptchaService,
        private imageService: ImageService,
        private editorService: EditorService,
        private historyService: HistoryService,
        private featureFlagService: FeatureFlagService
    ) {}

    @Public()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/sentence/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getClaimReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { data_hash, personalitySlug, claimSlug } = req.params;
        const personality = await this.personalityService.getPersonalityBySlug(
            {
                slug: personalitySlug,
                isDeleted: false,
            },
            req.language
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            undefined,
            false
        );

        const sentence = await this.sentenceService.getByDataHash(data_hash);

        await this.returnClaimReviewPage(
            data_hash,
            req,
            res,
            claim,
            sentence,
            personality
        );
    }

    private async returnClaimReviewPage(
        data_hash: string,
        req: BaseRequest,
        res: Response,
        claim: any,
        content: ISentence | ImageDocument,
        personality: any = null
    ) {
        const hideDescriptions: Record<string, any> = {};

        const reviewTask =
            await this.reviewTaskService.getReviewTaskByDataHashWithUsernames(
                data_hash
            );

        const claimReview = await this.claimReviewService.getReviewByDataHash(
            data_hash
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
        const enableInformativeNews =
            this.featureFlagService.isEnableInformativeNews();

        hideDescriptions[TargetModel.Claim] =
            await this.historyService.getDescriptionForHide(
                claim,
                TargetModel.Claim
            );

        if (claimReview) {
            hideDescriptions[TargetModel.ClaimReview] =
                await this.historyService.getDescriptionForHide(
                    claimReview,
                    TargetModel.ClaimReview
                );
        }

        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            personality,
            claim,
            content,
            reviewTask,
            claimReview,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            hideDescriptions,
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            enableInformativeNews,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/claim-review", queryObject);
    }

    @Public()
    @ApiTags("pages")
    @Get("claim/:claimId/image/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getImageWithoutPersonalityClaimReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const validatedParams = GetByDataHashDto.parse({
            data_hash: req.params.data_hash,
        });

        const { data_hash } = validatedParams;

        const { claimId, namespace } = req.params;
        const claim = await this.claimService.getById(
            claimId,
            namespace as NameSpaceEnum
        );
        const image = await this.imageService.getByDataHash(data_hash);
        await this.returnClaimReviewPage(data_hash, req, res, claim, image);
    }

    @AdminOnly()
    @Get("claim/:claimId/debate/edit")
    @ApiTags("pages")
    @Header("Cache-Control", "private, max-age=60, must-revalidate")
    public async getDebateEditor(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const { claimId, namespace } = req.params;

        const claim = await this.claimService.getById(
            claimId,
            namespace as NameSpaceEnum
        );
        const editor = await this.editorService.getByReference(claim.contentId);
        claim.editor = editor;

        const queryObject = Object.assign(parsedUrl.query, {
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/debate-editor", queryObject);
    }

    @Public()
    @ApiTags("pages")
    @Get("claim/:claimId/debate")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getDebate(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const { claimId, namespace } = req.params;

        const claim = await this.claimService.getById(
            claimId,
            namespace as NameSpaceEnum
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

        const queryObject = Object.assign(parsedUrl.query, {
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            captcha: this.captchaService.getClientConfig(),
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: req.params.namespace,
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableReviewersUpdateReport,
            enableViewReportPreview,
        });

        await this.viewService.render(req, res, "/debate-page", queryObject);
    }

    @Public()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/image/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getImageClaimReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const validatedParams = GetByDataHashDto.parse({
            data_hash: req.params.data_hash,
        });

        const { data_hash } = validatedParams;

        const { personalitySlug, claimSlug } = req.params;
        const personality = await this.personalityService.getPersonalityBySlug(
            {
                slug: personalitySlug,
                isDeleted: false,
            },
            req.language
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            undefined,
            false
        );

        const image = await this.imageService.getByDataHash(data_hash);

        await this.returnClaimReviewPage(
            data_hash,
            req,
            res,
            claim,
            image,
            personality
        );
    }

    @Public()
    @Redirect()
    @ApiTags("pages")
    @Get("claim/:claimSlug/sentence/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getClaimReviewPageWithoutPersonality(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const {
            data_hash,
            claimSlug,
            namespace = NameSpaceEnum.Main,
        } = req.params;

        const claim = await this.claimService.getByClaimSlug(
            claimSlug,
            undefined,
            false
        );
        redirectBasedOnPersonality(res, claim, namespace, data_hash);
        const sentence = await this.sentenceService.getByDataHash(data_hash);

        await this.returnClaimReviewPage(data_hash, req, res, claim, sentence);
    }
}
