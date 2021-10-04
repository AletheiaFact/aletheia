import {
    Body,
    Controller,
    Delete,
    Get,
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
import * as mongoose from "mongoose";
import {Request, Response} from "express";
import {parse} from "url";
import {PersonalityService} from "../personality/personality.service";
import {ViewService} from "../view/view.service";

@Controller()
export class ClaimController {
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
    listAll(@Query() query) {
        const { page = 0, pageSize = 10, order = "asc" } = query;
        const queryInputs = this._verifyInputsQuery(query);

        return Promise.all([
            this.claimService.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs
            ),
            this.claimService.count(queryInputs),
        ]).then(([claims, totalClaims]) => {
            const totalPages = Math.ceil(totalClaims / parseInt(pageSize, 10));

            // this.logger.log(
            //     "info",
            //     `Found ${totalClaims} claims. Page ${page} of ${totalPages}`
            // );

            return {
                claims,
                totalClaims,
                totalPages,
                page,
                pageSize,
            };
        });
        // .catch((error) => this.logger.log("error", error));
    }

    // @UseGuards(SessionGuard)
    @Post("api/claim")
    async create(@Body() body) {
        const secret = this.configService.get<string>("recaptcha_secret");
        const recaptchaCheck = await this._checkCaptchaResponse(
            secret,
            body && body.recaptcha
        );

        // @ts-ignore
        if (!recaptchaCheck.success) {
            throw Error();
            // app.logger.log("error/recaptcha", recaptchaCheck);
            // next(
            //     Requester.internalError(res, "Error with your reCaptcha response")
            // );
        }
        const claim = await this.claimService.create(body);
        return claim;
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
    getSentenceReviewsByHash(@Req() req) {
        const { sentenceHash } = req.params;
        const { page, pageSize, order } = req.query;

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

            // this.logger.log(
            //     "info",
            //     `Found ${totalReviews} reviews for sentence hash ${sentenceHash}. Page ${page} of ${totalPages}`
            // );

            return {
                reviews,
                totalReviews,
                totalPages,
                page,
                pageSize,
            };
        });
    }

    @Get("api/claim/:claimId/sentence/:sentenceHash")
    getSentenceByHash(@Req() req) {
        const { sentenceHash, claimId } = req.params;
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

    @Get("personality/:id/claim/create/")
    public async claimCreatePage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const language = "en";

        const personality = await this.personalityService.getById(
            req.params.id,
            language
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

    @Get("personality/:id/claim/:claimId/")
    public async personalityPage(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const language = "en";

        const personality = await this.personalityService.getById(
            req.params.id,
            language
        );

        const claim = await this.claimService.getById(req.params.claimId);

        await this.viewService
            .getNextServer()
            .render(
                req,
                res,
                "/claim",
                Object.assign(parsedUrl.query, { personality, claim })
            );
    }
}
