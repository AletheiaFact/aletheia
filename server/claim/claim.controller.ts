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
    Optional,
    NotFoundException,
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
import { ClaimReviewTaskService } from "../claim-review-task/claim-review-task.service";
import { TargetModel } from "../history/schema/history.schema";
import { SentenceService } from "./types/sentence/sentence.service";
import type { BaseRequest } from "../types";
import slugify from "slugify";
import { UnleashService } from "nestjs-unleash";
import { ContentModelEnum } from "../types/enums";
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

@Controller()
export class ClaimController {
    private readonly logger = new Logger("ClaimController");
    constructor(
        private claimReviewService: ClaimReviewService,
        private claimReviewTaskService: ClaimReviewTaskService,
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
        @Optional() private readonly unleash: UnleashService
    ) {}

    _verifyInputsQuery(query) {
        const inputs = {};
        if (query.personality) {
            // @ts-ignore
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
            return { title: claim.title, path };
        } catch (error) {
            return error;
        }
    }

    // TODO: create a image controller under types and move the endpoints to it
    @ApiTags("claim")
    @Post("api/claim/image")
    async createClaimImage(@Body() createClaimDTO) {
        if (!this.isEnabledImageClaim()) {
            throw new NotFoundException();
        }
        try {
            const claim = await this._createClaim(createClaimDTO);

            const personality = claim.personalities[0]
                ? await this.personalityService.getById(claim.personalities[0])
                : null;
            const path = personality
                ? `/personality/${personality.slug}/claim/${claim.slug}`
                : `/claim/${claim._id}`;
            return { title: claim.title, path };
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
                req.user.role === Roles.Admin
                    ? `/claim/${claim._id}/debate/edit`
                    : `/claim/${claim._id}/debate`;
            return { title: claim.title, path };
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
        if (content && personality) {
            newSpeech = await this.parserService.parse(
                updateClaimDebateDto.content,
                updateClaimDebateDto.personality
            );

            await this.debateService.addSpeechToDebate(debateId, newSpeech._id);
            return newSpeech;
        } else {
            return this.debateService.updateDebateStatus(debateId, isLive);
        }
    }

    private async _createClaim(createClaimDTO) {
        const validateCaptcha = await this.captchaService.validate(
            createClaimDTO.recaptcha
        );
        if (!validateCaptcha) {
            throw new Error("Error validating captcha");
        }
        return this.claimService.create(createClaimDTO);
    }

    @IsPublic()
    @Get("api/claim/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    @ApiTags("claim")
    getById(@Param("id") claimId) {
        return this.claimService.getById(claimId);
    }

    @ApiTags("claim")
    @Put("api/claim/:id")
    update(@Param("id") claimId, @Body() updateClaimDTO: UpdateClaimDTO) {
        return this.claimService.update(claimId, updateClaimDTO);
    }

    @ApiTags("claim")
    @Delete("api/claim/:id")
    delete(@Param("id") claimId) {
        return this.claimService.delete(claimId);
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
            personalitySlug,
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
        const claimReviewTask =
            await this.claimReviewTaskService.getClaimReviewTaskByDataHashWithUsernames(
                data_hash
            );

        const claimReview = await this.claimReviewService.getReviewByDataHash(
            data_hash
        );

        const enableCollaborativeEditor = this.isEnableCollaborativeEditor();

        const description = await this.claimReviewService.getDescriptionForHide(
            claimReview
        );

        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-review",
            Object.assign(parsedUrl.query, {
                personality,
                claim,
                content,
                claimReviewTask,
                claimReview,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                description,
                enableCollaborativeEditor,
                websocketUrl: this.configService.get<string>("websocketUrl"),
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("claim/:claimId/image/:data_hash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getImageWithoutPersonalityClaimReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { data_hash, claimId } = req.params;
        const claim = await this.claimService.getById(claimId);
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
        const { claimId } = req.params;

        const claim = await this.claimService.getById(claimId);
        const editor = await this.editorService.getByReference(claim.contentId);
        claim.editor = editor;

        await this.viewService.getNextServer().render(
            req,
            res,
            "/debate-editor",
            Object.assign(parsedUrl.query, {
                claim,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("claim/:claimId/debate")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getDebate(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const { claimId } = req.params;

        const claim = await this.claimService.getById(claimId);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/debate-page",
            Object.assign(parsedUrl.query, {
                claim,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                websocketUrl: this.configService.get<string>("websocketUrl"),
            })
        );
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
            personalitySlug,
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
        @Query() query: { personality?: string },
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const enableImageClaim = this.isEnabledImageClaim();

        const personality = query.personality
            ? await this.personalityService.getClaimsByPersonalitySlug(
                  query.personality,
                  req.language
              )
            : null;

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-create",
            Object.assign(parsedUrl.query, {
                personality,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                enableImageClaim,
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("claim")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async claimsWithoutPersonalityPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        if (!this.isEnabledImageClaim()) {
            throw new NotFoundException();
        }

        const parsedUrl = parse(req.url, true);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/image-claims-page",
                Object.assign(parsedUrl.query, {})
            );
    }

    @IsPublic()
    @Redirect()
    @ApiTags("pages")
    @Get("claim/:claimId")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async imageClaimPage(@Req() req: BaseRequest, @Res() res: Response) {
        const { claimId } = req.params;
        const parsedUrl = parse(req.url, true);
        const claim = await this.claimService.getById(claimId);

        const enableCollaborativeEditor = this.isEnableCollaborativeEditor();

        if (
            claim.contentModel === ContentModelEnum.Image &&
            !this.isEnabledImageClaim()
        ) {
            throw new NotFoundException();
        }

        if (claim.personalities.length > 0) {
            const personalitySlug = slugify(claim.personalities[0].name, {
                lower: true,
                strict: true,
            });
            return res.redirect(
                `/personality/${personalitySlug}/claim/${claim.slug}`
            );
        }
        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-page",
            Object.assign(parsedUrl.query, {
                claim,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                enableCollaborativeEditor,
                websocketUrl: this.configService.get<string>("websocketUrl"),
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async personalityClaimPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);

        const enableCollaborativeEditor = this.isEnableCollaborativeEditor();

        const personality =
            await this.personalityService.getClaimsByPersonalitySlug(
                personalitySlug,
                req.language
            );
        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug
        );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-page",
            Object.assign(parsedUrl.query, {
                personality,
                claim,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                enableCollaborativeEditor,
                websocketUrl: this.configService.get<string>("websocketUrl"),
            })
        );
    }

    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/revision/:revisionId")
    public async personalityClaimPageWithRevision(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const { personalitySlug, claimSlug, revisionId } = req.params;
        const parsedUrl = parse(req.url, true);
        const personality =
            await this.personalityService.getClaimsByPersonalitySlug(
                personalitySlug,
                req.language
            );

        const enableCollaborativeEditor = this.isEnableCollaborativeEditor();

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            revisionId
        );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-page",
            Object.assign(parsedUrl.query, {
                personality,
                claim,
                enableCollaborativeEditor,
                websocketUrl: this.configService.get<string>("websocketUrl"),
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/sources")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async sourcesClaimPage(@Req() req: Request, @Res() res: Response) {
        const { personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getPersonalityBySlug(
            personalitySlug
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug,
            undefined,
            false
        );

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/sources-page",
                Object.assign(parsedUrl.query, { targetId: claim._id })
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

        const personality = await this.personalityService.getPersonalityBySlug(
            personalitySlug
        );

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

        await this.viewService.getNextServer().render(
            req,
            res,
            "/sources-page",
            Object.assign(parsedUrl.query, {
                targetId: report._id,
            })
        );
    }

    @ApiTags("pages")
    @Get("personality/:personalitySlug/claim/:claimSlug/history")
    public async ClaimHistoryPage(@Req() req: Request, @Res() res: Response) {
        const { personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);

        const personality =
            await this.personalityService.getClaimsByPersonalitySlug(
                personalitySlug
            );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug
        );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/history-page",
            Object.assign(parsedUrl.query, {
                targetId: claim._id,
                targetModel: TargetModel.Claim,
            })
        );
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

        const claimReviewTask =
            await this.claimReviewTaskService.getClaimReviewTaskByDataHash(
                data_hash
            );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/history-page",
            Object.assign(parsedUrl.query, {
                targetId: claimReviewTask._id,
                targetModel: TargetModel.ClaimReviewTask,
            })
        );
    }

    private isEnabledImageClaim() {
        const config = this.configService.get<string>("feature_flag");

        return config ? this.unleash.isEnabled("enable_image_claim") : false;
    }

    private isEnableCollaborativeEditor() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_collaborative_editor")
            : false;
    }
}
