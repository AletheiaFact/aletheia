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
import {Request, Response} from "express";
import {parse} from "url";
import {PersonalityService} from "../personality/personality.service";
import {ViewService} from "../view/view.service";
import * as mongoose from "mongoose";
import { CreateClaim } from "./dto/create-claim.dto";
import { GetClaims } from "./dto/get-claims.dto";
import { GetClaimsByHash } from "./dto/get-reviews-by-hash.dto";

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
    listAll(@Query() getClaims: GetClaims) {
        const { page = 0, pageSize = 10, order = "asc" } = getClaims;
        const queryInputs = this._verifyInputsQuery(getClaims);
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
    async create(@Body() createClaim: CreateClaim) {
        const secret = this.configService.get<string>("recaptcha_secret");
        const recaptchaCheck = await this._checkCaptchaResponse(
            secret,
            createClaim && createClaim.recaptcha
        );

        // @ts-ignore
        if (!recaptchaCheck.success) {
            this.logger.error(`error/recaptcha ${recaptchaCheck}`);
            // next(
            //     Requester.internalError(res, "Error with your reCaptcha response")
            // );
            throw Error();
        }
        return await this.claimService.create(createClaim);
    }

    @Get("api/claim/:id")
    getById(@Param() params) {
        return this.claimService.getById(params.id);
    }

    @UseGuards(SessionGuard)
    @Put("api/claim/:id")
    update(@Req() req) {
        return this.claimService.update(req.params.id, req.body);
    }

    @UseGuards(SessionGuard)
    @Delete("api/claim/:id")
    delete(@Param() params) {
        return this.claimService.delete(params.id);
    }

    @Get("api/claim/:claimId/sentence/:sentenceHash/reviews")
    getSentenceReviewsByHash(@Param() params, @Query() getClaimsByHash: GetClaimsByHash) {
        const { sentenceHash } = params;
        const { page, pageSize, order } = getClaimsByHash;

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

    @Get("api/claim/:claimId/sentence/:sentenceHash")
    getSentenceByHash(@Req() req) {
        const { sentenceHash, claimId } = req.params;
        return this._getSentenceByHashAndClaimId(sentenceHash, claimId, req);
    }

    @Get("personality/:personalitySlug/claim/:claimSlug/sentence/:sentenceHash")
    public async getClaimReviewPage(@Req() req: Request, @Res() res: Response) {
        const { sentenceHash, personalitySlug, claimSlug } = req.params;
        const parsedUrl = parse(req.url, true);
        // @ts-ignore
        req.language = req.headers["accept-language"] || "en";

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
        req.language = req.headers["accept-language"] || "en";

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
        req.language = req.headers["accept-language"] || "en";

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
}
