import {
    Body,
    Controller,
    Delete,
    Get, Logger,
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
import * as qs from "querystring";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { SessionGuard } from "../auth/session.guard";
import { Request, Response } from "express";
import { parse } from "url";
import { PersonalityService } from "../personality/personality.service";
import { ViewService } from "../view/view.service";
import * as mongoose from "mongoose";
import { CreateClaimDTO } from "./dto/create-claim.dto";
import { GetClaimsDTO } from "./dto/get-claims.dto";
import { GetClaimsByHashDTO } from "./dto/get-reviews-by-hash.dto";
import { UpdateClaimDTO } from "./dto/update-claim.dto"
@Controller()
export class ClaimController {
    private readonly logger = new Logger("ClaimController");
    constructor(
        private claimReviewService: ClaimReviewService,
        private personalityService: PersonalityService,
        private claimService: ClaimService,
        private configService: ConfigService,
        private httpService: HttpService,
        private viewService: ViewService,
    ) {}

    async _checkCaptchaResponse(secret, response) {
        const RECAPTCHA_API_URL = "https://www.google.com/recaptcha/api";
        const { data } = await this.httpService.post(
            `${RECAPTCHA_API_URL}/siteverify`,
            qs.stringify({
                secret,
                response,
            })
        ).toPromise();

        return data;
    }
    _verifyInputsQuery(query) {
        const queryInputs = {};
        if (query.personality) {
            // @ts-ignore
            queryInputs.personality = new mongoose.Types.ObjectId(query.personality);
        }

        return queryInputs;
    }

    @Get("api/claim")
    listAll(@Query() getClaimsDTO: GetClaimsDTO) {
        const { page = 0, pageSize = 10, order = "asc" } = getClaimsDTO;
        const queryInputs = this._verifyInputsQuery(getClaimsDTO);
        return Promise.all([
            this.claimService.listAll(
                page,
                pageSize,
                order,
                queryInputs
            ),
            this.claimService.count(queryInputs),
        ]).then(([claims, totalClaims]) => {
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
        }).catch((error) => this.logger.error(error));
    }

    @UseGuards(SessionGuard)
    @Post("api/claim")
    async create(@Body() createClaimDTO: CreateClaimDTO) {
        const secret = this.configService.get<string>("recaptcha_secret");
        const recaptchaCheck = await this._checkCaptchaResponse(
            secret,
            createClaimDTO && createClaimDTO.recaptcha
        );

        // @ts-ignore
        if (!recaptchaCheck.success) {
            this.logger.error(`error/recaptcha ${recaptchaCheck}`);
            // next(
            //     Requester.internalError(res, "Error with your reCaptcha response")
            // );
            throw Error();
        }
        return this.claimService.create(createClaimDTO)

    }

    @Get("api/claim/:id")
    getById(@Param("id") claimId) {
        return this.claimService.getById(claimId);
    }

    @UseGuards(SessionGuard)
    @Put("api/claim/:id")
    update(@Param("id") claimId, @Body() updateClaimDTO: UpdateClaimDTO) {
        return this.claimService.update(claimId, updateClaimDTO);
    }

    @UseGuards(SessionGuard)
    @Delete("api/claim/:id")
    delete(@Param("id") claimId) {
        return this.claimService.delete(claimId);
    }

    @Get("api/claim/:claimId/sentence/:sentenceHash/reviews")
    getSentenceReviewsByHash(@Param() params, @Query() getClaimsByHashDTO: GetClaimsByHashDTO) {
        const { sentenceHash } = params;
        const { page, pageSize, order } = getClaimsByHashDTO;

        return Promise.all([
            this.claimReviewService.getReviewsBySentenceHash(
                sentenceHash,
                page,
                pageSize,
                order || "desc"
            ),
            this.claimReviewService.countReviewsBySentenceHash(sentenceHash),
        ]).then(([reviews, totalReviews]) => {
            totalReviews = totalReviews[0]?.count;
            // @ts-ignore
            const totalPages = Math.ceil(totalReviews / parseInt(pageSize, 10));

            this.logger.log(
                `Found ${totalReviews} reviews for sentence hash ${sentenceHash}. Page ${page} of ${totalPages}`
            );

            return {
                reviews,
                totalReviews,
                totalPages,
                page,
                pageSize,
            };
        });
    }

    _getSentenceByHashAndClaimId(sentenceHash, claimId, req) {
        const user = req.user;
        return Promise.all([
            this.claimReviewService.getReviewStatsBySentenceHash(sentenceHash),
            this.claimService.getById(claimId),
            this.claimReviewService.getUserReviewBySentenceHash(
                sentenceHash,
                user?._id
            ),
        ]).then(([stats, claimObj, userReview]) => {
            let sentenceObj;

            claimObj.content.object.forEach((p) => {
                p.content.forEach((sentence) => {
                    if (sentence.props["data-hash"] === sentenceHash) {
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

    @Get("personality/:personalitySlug/claim/:claimSlug/sentence/:sentenceHash")
    public async getClaimReviewPage(@Req() req: Request, @Res() res: Response) {
        const { sentenceHash, personalitySlug, claimSlug } = req.params;
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

        const sentence = await this._getSentenceByHashAndClaimId(sentenceHash, claim._id, req);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim-review",
                Object.assign(parsedUrl.query, {
                    personality,
                    claim,
                    sentence,
                    sitekey: this.configService.get<string>("recaptcha_sitekey"),
                })
            );
    }

    @Get("personality/:slug/claim/create/")
    public async claimCreatePage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore

        const personality = await this.personalityService.getBySlug(
            req.params.slug,
            // @ts-ignore
            req.language
        );

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim-create",
                Object.assign(parsedUrl.query, {
                    personality,
                    sitekey: this.configService.get<string>("recaptcha_sitekey"),
                })
            );
    }

    @Get("personality/:personalitySlug/claim/:claimSlug")
    public async personalityClaimPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        try{
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
        } catch {
            await this.viewService
                .getNextServer()
                .render(req,res, '/404-page', Object.assign(parsedUrl.query))
        }
    }

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
                "/claim-sources-page",
                Object.assign(parsedUrl.query, { claimId: claim._id })
            );
    }
}
