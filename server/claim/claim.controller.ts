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
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimService } from "./claim.service";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { parse } from "url";
import { PersonalityService } from "../personality/personality.service";
import { ViewService } from "../view/view.service";
import * as mongoose from "mongoose";
import { CreateClaimDTO } from "./dto/create-claim.dto";
import { GetClaimsDTO } from "./dto/get-claims.dto";
import { UpdateClaimDTO } from "./dto/update-claim.dto";
import { IsPublic } from "../decorators/is-public.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { ClaimReviewTaskService } from "../claim-review-task/claim-review-task.service";
import { TargetModel } from "../history/schema/history.schema";
import { UserRoles } from "../auth/roles.enum";
import { Roles } from "../auth/role.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller()
export class ClaimController {
    private readonly logger = new Logger("ClaimController");
    constructor(
        private claimReviewService: ClaimReviewService,
        private claimReviewTaskService: ClaimReviewTaskService,
        private personalityService: PersonalityService,
        private claimService: ClaimService,
        private configService: ConfigService,
        private viewService: ViewService,
        private captchaService: CaptchaService
    ) {}

    _verifyInputsQuery(query) {
        const inputs = {};
        if (query.personality) {
            // @ts-ignore
            inputs.personality = new mongoose.Types.ObjectId(query.personality);
        }

        return inputs;
    }

    @IsPublic()
    @Get("api/claim")
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

    @Post("api/claim")
    async create(@Body() createClaimDTO: CreateClaimDTO) {
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
    getById(@Param("id") claimId) {
        return this.claimService.getById(claimId);
    }

    @Put("api/claim/:id")
    update(@Param("id") claimId, @Body() updateClaimDTO: UpdateClaimDTO) {
        return this.claimService.update(claimId, updateClaimDTO);
    }

    @Delete("api/claim/:id")
    delete(@Param("id") claimId) {
        return this.claimService.delete(claimId);
    }

    _getSentenceByHashAndClaimId(sentence_hash, claimId) {
        return Promise.all([
            this.claimReviewService.getReviewStatsBySentenceHash({
                sentence_hash,
                isDeleted: false,
                isPublished: true,
            }),
            this.claimService.getById(claimId),
            this.claimReviewService.getUserReviewBySentenceHash(sentence_hash),
        ]).then(([stats, claimObj, userReview]) => {
            let sentenceObj;

            claimObj.content.forEach((p) => {
                p.content.forEach((sentence) => {
                    if (sentence.data_hash === sentence_hash) {
                        sentenceObj = sentence;
                    }
                });
            });
            return {
                userReview,
                date: claimObj.date,
                personality: claimObj.personality,
                stats,
                ...sentenceObj,
            };
        });
    }

    @IsPublic()
    @Get(
        "personality/:personalitySlug/claim/:claimSlug/sentence/:sentence_hash"
    )
    @UseGuards(RolesGuard)
    @Roles(UserRoles.FACTCHECKER)
    public async getClaimReviewPage(@Req() req: Request, @Res() res: Response) {
        const { sentence_hash, personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);
        const personality = await this.personalityService.getBySlug(
            personalitySlug,
            // @ts-ignore
            req.language
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug
        );

        const sentence = await this._getSentenceByHashAndClaimId(
            sentence_hash,
            claim._id
        );

        const claimReviewTask =
            await this.claimReviewTaskService.getClaimReviewTaskBySentenceHash(
                sentence_hash
            );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-review",
            Object.assign(parsedUrl.query, {
                personality,
                claim,
                sentence,
                claimReviewTask,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }

    @Get("personality/:slug/claim/create/")
    public async claimCreatePage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getBySlug(
            req.params.slug,
            // @ts-ignore
            req.language
        );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-create",
            Object.assign(parsedUrl.query, {
                personality,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }

    @IsPublic()
    @Get("personality/:personalitySlug/claim/:claimSlug")
    public async personalityClaimPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getBySlug(
            req.params.personalitySlug,
            // @ts-ignore
            req.language
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            req.params.claimSlug
        );

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim-page",
                Object.assign(parsedUrl.query, { personality, claim })
            );
    }

    @Get("personality/:personalitySlug/claim/:claimSlug/revision/:revisionId")
    public async personalityClaimPageWithRevision(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        const personality = await this.personalityService.getBySlug(
            req.params.personalitySlug,
            // @ts-ignore
            req.language
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            req.params.claimSlug,
            req?.params?.revisionId
        );

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim-page",
                Object.assign(parsedUrl.query, { personality, claim })
            );
    }

    @IsPublic()
    @Get("personality/:personalitySlug/claim/:claimSlug/sources")
    public async sourcesClaimPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getBySlug(
            req.params.personalitySlug
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            req.params.claimSlug
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
    @Get(
        "personality/:personalitySlug/claim/:claimSlug/sentence/:sentence_hash/sources"
    )
    public async sourcesReportPage(@Req() req: Request, @Res() res: Response) {
        const { sentence_hash, personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getBySlug(
            personalitySlug
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            claimSlug
        );

        const report = await this.claimReviewService.getReport({
            personality: personality._id,
            claim: claim._id,
            sentence_hash,
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

    @Get("personality/:personalitySlug/claim/:claimSlug/history")
    public async ClaimHistoryPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);

        const personality = await this.personalityService.getBySlug(
            req.params.personalitySlug
        );

        const claim = await this.claimService.getByPersonalityIdAndClaimSlug(
            personality._id,
            req.params.claimSlug
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

    @Get(
        "personality/:personalitySlug/claim/:claimSlug/sentence/:sentence_hash/history"
    )
    public async ClaimReviewHistoryPage(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const claimReviewTask =
            await this.claimReviewTaskService.getClaimReviewTaskBySentenceHash(
                req.params.sentence_hash
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
}
