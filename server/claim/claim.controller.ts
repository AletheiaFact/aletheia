import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    Redirect,
    Req,
    Res,
    Header,
    UseGuards,
} from "@nestjs/common";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimService } from "./claim.service";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { parse } from "url";
import { PersonalityService } from "../personality/personality.service";
import { ViewService } from "../view/view.service";
import * as mongoose from "mongoose";
import { CreateClaimDTO } from "./dto/create-claim.dto";
import { GetClaimsDTO } from "./dto/get-claims.dto";
import { UpdateClaimDTO } from "./dto/update-claim.dto";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { TargetModel } from "../history/schema/history.schema";
import { SentenceService } from "./types/sentence/sentence.service";
import type { BaseRequest } from "../types";
import slugify from "slugify";
import { SentenceDocument } from "./types/sentence/schemas/sentence.schema";
import { ImageService } from "./types/image/image.service";
import { ImageDocument } from "./types/image/schemas/image.schema";
import { CreateDebateClaimDTO } from "./dto/create-debate-claim.dto";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import {
    AdminUserAbility,
    CheckAbilities,
} from "../auth/ability/ability.decorator";
import { DebateService } from "./types/debate/debate.service";
import { EditorService } from "../editor/editor.service";
import { UpdateDebateDto } from "./dto/update-debate.dto";
import { ParserService } from "./parser/parser.service";
import { Roles } from "../auth/ability/ability.factory";
import { ApiTags } from "@nestjs/swagger";
import { HistoryService } from "../history/history.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { ClaimRevisionService } from "./claim-revision/claim-revision.service";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { Types } from "mongoose";
import { GroupService } from "../group/group.service";

@Controller(":namespace?")
export class ClaimController {
    private readonly logger = new Logger("ClaimController");
    constructor(
        private claimReviewService: ClaimReviewService,
        private reviewTaskService: ReviewTaskService,
        private personalityService: PersonalityService,
        private claimService: ClaimService,
        private sentenceService: SentenceService,
        private configService: ConfigService,
        private viewService: ViewService,
        private captchaService: CaptchaService,
        private imageService: ImageService,
        private debateService: DebateService,
        private editorService: EditorService,
        private parserService: ParserService,
        private historyService: HistoryService,
        private claimRevisionService: ClaimRevisionService,
        private featureFlagService: FeatureFlagService,
        private groupService: GroupService
    ) {}

    _verifyInputsQuery(query) {
        const inputs: any = {
            isHidden: query.isHidden,
        };
        if (query.nameSpace) {
            inputs.nameSpace = query.nameSpace;
        }
        if (query.personality && !query.isHidden) {
            inputs.personalities = new mongoose.Types.ObjectId(
                // @ts-ignore
                query.personality
            );
        }

        return inputs;
    }

    @IsPublic()
    @ApiTags("claim")
    @Get("api/claim")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    listAll(@Query() getClaimsDTO: GetClaimsDTO) {
        const { page = 0, pageSize = 10, order = "asc" } = getClaimsDTO;
        const queryInputs = this._verifyInputsQuery(getClaimsDTO);
        return Promise.all([
            this.claimService.listAll(page, pageSize, order, queryInputs),
            this.claimService.count(queryInputs),
        ])
            .then(([claims, totalClaims]) => {
                const totalPages = Math.ceil(totalClaims / pageSize);

                this.logger.log(
                    `Found ${totalClaims} claims. Page ${page} of ${totalPages}`
                );

                return {
                    claims,
                    totalClaims,
                    totalPages,
                    page,
                    pageSize,
                };
            })
            .catch((error) => this.logger.error(error));
    }

    @ApiTags("claim")
    @Post("api/claim")
    async create(@Body() createClaimDTO: CreateClaimDTO) {
        try {
            const claim = await this._createClaim(createClaimDTO);
            const personality = await this.personalityService.getById(
                claim.personalities[0]
            );
            const path = claim.slug
                ? `/personality/${personality.slug}/claim/${claim.slug}`
                : `/personality/${personality.slug}`;
            return {
                _id: claim._id,
                title: claim.title,
                path:
                    claim.nameSpace !== NameSpaceEnum.Main
                        ? `/${claim.nameSpace}${path}`
                        : path,
            };
        } catch (error) {
            return error;
        }
    }

    // TODO: create a image controller under types and move the endpoints to it
    @ApiTags("claim")
    @Post("api/claim/image")
    async createClaimImage(@Body() createClaimDTO) {
        try {
            const claim = await this._createClaim(createClaimDTO);

            const personality = claim.personalities[0]
                ? await this.personalityService.getById(claim.personalities[0])
                : null;
            const path = personality
                ? `/personality/${personality.slug}/claim/${claim.slug}`
                : `/claim/${claim.slug}`;
            return {
                title: claim.title,
                path:
                    claim.nameSpace !== NameSpaceEnum.Main
                        ? `/${claim.nameSpace}${path}`
                        : path,
            };
        } catch (error) {
            return error;
        }
    }

    // TODO: create a debate controller under types and move the endpoints to it
    @ApiTags("claim")
    @Post("api/claim/debate")
    async createClaimDebate(
        @Body() createClaimDTO: CreateDebateClaimDTO,
        @Req() req: BaseRequest
    ) {
        try {
            const claim = await this._createClaim(createClaimDTO);

            const path =
                req.user.role[claim.nameSpace] === Roles.Admin ||
                req.user.role[claim.nameSpace] === Roles.SuperAdmin
                    ? `/claim/${claim._id}/debate/edit`
                    : `/claim/${claim._id}/debate`;
            return {
                title: claim.title,
                path:
                    claim.nameSpace !== NameSpaceEnum.Main
                        ? `/${claim.nameSpace}${path}`
                        : path,
            };
        } catch (error) {
            return error;
        }
    }

    @IsPublic() // Allow this route to be public temporarily for testing
    @ApiTags("claim")
    @Post("api/claim/unattributed")
    async createUnattributedClaim(@Body() createClaimDTO) {
        try {
            const claim = await this._createClaim(createClaimDTO, true);

            return {
                title: claim.title,
                path:
                    claim.nameSpace !== NameSpaceEnum.Main
                        ? `/${claim.nameSpace}/claim/${claim.slug}`
                        : `/claim/${claim.slug}`,
            };
        } catch (error) {
            return error;
        }
    }

    @ApiTags("claim")
    @Put("api/claim/debate/:debateId")
    async updateClaimDebate(
        @Param("debateId") debateId,
        @Body() updateClaimDebateDto: UpdateDebateDto
    ) {
        const { content, personality, isLive } = updateClaimDebateDto;
        let newSpeech;

        const claimRevision = await this.claimRevisionService.getByContentId(
            Types.ObjectId(debateId)
        );

        const claimRevisionId = Types.ObjectId(claimRevision._id);

        if (content && personality) {
            newSpeech = await this.parserService.parse(
                updateClaimDebateDto.content,
                claimRevisionId,
                updateClaimDebateDto.personality
            );

            await this.debateService.addSpeechToDebate(debateId, newSpeech._id);
            return newSpeech;
        } else {
            return this.debateService.updateDebateStatus(debateId, isLive);
        }
    }

    private async _createClaim(
        createClaimDTO,
        overrideCaptchaValidation = false
    ) {
        const validateCaptcha = await this.captchaService.validate(
            createClaimDTO.recaptcha
        );
        if (!validateCaptcha && !overrideCaptchaValidation) {
            throw new Error("Error validating captcha");
        }
        return this.claimService.create(createClaimDTO);
    }

    @IsPublic()
    @Get("api/claim/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    @ApiTags("claim")
    getById(@Param("id") claimId, @Query() query) {
        return this.claimService.getById(claimId, query.nameSpace);
    }

    @ApiTags("claim")
    @Put("api/claim/:id")
    update(@Param("id") claimId, @Body() updateClaimDTO: UpdateClaimDTO) {
        return this.claimService.update(claimId, updateClaimDTO);
    }

    @ApiTags("claim")
    @Delete("api/claim/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async delete(@Param("id") claimId) {
        return this.claimService.delete(claimId);
    }

    @ApiTags("claim")
    @Put("api/claim/hidden/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async updateHiddenStatus(@Param("id") claimId, @Body() body) {
        const validateCaptcha = await this.captchaService.validate(
            body.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }

        return this.claimService.hideOrUnhideClaim(
            claimId,
            body.isHidden,
            body.description
        );
    }

    @IsPublic()
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
        content: SentenceDocument | ImageDocument,
        personality: any = null
    ) {
        const hideDescriptions = {};

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
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        hideDescriptions[TargetModel.Claim] =
            await this.historyService.getDescriptionForHide(
                claim,
                TargetModel.Claim
            );

        hideDescriptions[TargetModel.ClaimReview] =
            await this.historyService.getDescriptionForHide(
                claimReview,
                TargetModel.ClaimReview
            );

        const parsedUrl = parse(req.url, true);
        const queryObject = Object.assign(parsedUrl.query, {
            personality,
            claim,
            content,
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
        });

        await this.viewService.render(req, res, "/claim-review", queryObject);
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("claim/:claimId/image/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getImageWithoutPersonalityClaimReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { data_hash, claimId, namespace } = req.params;
        const claim = await this.claimService.getById(
            claimId,
            namespace as NameSpaceEnum
        );
        const image = await this.imageService.getByDataHash(data_hash);
        await this.returnClaimReviewPage(data_hash, req, res, claim, image);
    }

    @Get("claim/:claimId/debate/edit")
    @ApiTags("pages")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
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
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/debate-editor", queryObject);
    }

    @IsPublic()
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
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        const queryObject = Object.assign(parsedUrl.query, {
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: req.params.namespace,
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableAddEditorSourcesWithoutSelecting,
            enableReviewersUpdateReport,
            enableViewReportPreview,
        });

        await this.viewService.render(req, res, "/debate-page", queryObject);
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/image/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getImageClaimReviewPage(
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

    @ApiTags("pages")
    @Get("claim/create")
    public async claimCreatePage(
        @Query() query: { personality?: string; verificationRequest?: string },
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
            nameSpace: req.params.namespace,
            verificationRequestGroup,
        });

        await this.viewService.render(req, res, "/claim-create", queryObject);
    }

    @IsPublic()
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

    @IsPublic()
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
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
        const enableReviewersUpdateReport =
            this.featureFlagService.isEnableReviewersUpdateReport();
        const enableViewReportPreview =
            this.featureFlagService.isEnableViewReportPreview();

        this.redirectBasedOnPersonality(res, claim, namespace);

        const queryObject = Object.assign(parsedUrl.query, {
            claim,
            sitekey: this.configService.get<string>("recaptcha_sitekey"),
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableAddEditorSourcesWithoutSelecting,
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
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
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
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot: enableCopilotChatBot,
            enableAddEditorSourcesWithoutSelecting,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/claim-page", queryObject);
    }

    @IsPublic()
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
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
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
            enableCollaborativeEditor,
            enableEditorAnnotations,
            enableCopilotChatBot,
            enableAddEditorSourcesWithoutSelecting,
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
        const enableAddEditorSourcesWithoutSelecting =
            this.featureFlagService.isEnableAddEditorSourcesWithoutSelecting();
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
            enableAddEditorSourcesWithoutSelecting,
            enableReviewersUpdateReport,
            enableViewReportPreview,
            websocketUrl: this.configService.get<string>("websocketUrl"),
            nameSpace: namespace,
        });

        await this.viewService.render(req, res, "/claim-page", queryObject);
    }

    @IsPublic()
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

    @IsPublic()
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
            targetId: report._id,
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

    @IsPublic()
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

        const queryObject = Object.assign(parsedUrl.query, {
            targetId: reviewTask._id,
            targetModel: TargetModel.ReviewTask,
            nameSpace: req.params.namespace,
        });

        await this.viewService.render(req, res, "/history-page", queryObject);
    }

    @IsPublic()
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
        this.redirectBasedOnPersonality(res, claim, namespace, data_hash);
        const sentence = await this.sentenceService.getByDataHash(data_hash);

        await this.returnClaimReviewPage(data_hash, req, res, claim, sentence);
    }

    private redirectBasedOnPersonality(
        res,
        claim,
        namespace,
        data_hash = null
    ) {
        const { personalities, slug } = claim;
        if (personalities.length <= 0) {
            return;
        }

        const personalitySlug = slugify(personalities[0].name, {
            lower: true,
            strict: true,
        });

        let redirectUrl =
            namespace !== NameSpaceEnum.Main
                ? `/${namespace}/personality/${personalitySlug}/claim/${slug}`
                : `/personality/${personalitySlug}/claim/${slug}`;

        if (data_hash) {
            redirectUrl += `/sentence/${data_hash}`;
        }

        return res.redirect(redirectUrl);
    }
}
