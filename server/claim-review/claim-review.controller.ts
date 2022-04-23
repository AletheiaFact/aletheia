import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { ClaimReviewService } from "./claim-review.service";
import * as qs from "querystring";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { CreateClaimReview } from "./dto/create-claim-review.dto";
import {IsPublic} from "../decorators/is-public.decorator";

@Controller("api/claimreview")
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private configService: ConfigService,
        private httpService: HttpService
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

    @Post()
    async create(@Body() createClaimReview: CreateClaimReview, @Req() req) {
        const secret = this.configService.get<string>("recaptcha_secret");
        const recaptchaCheck = await this._checkCaptchaResponse(
            secret,
            createClaimReview && createClaimReview.recaptcha
        );

        // @ts-ignore
        if (!recaptchaCheck.success) {
            throw Error();
            // app.logger.log("error/recaptcha", recaptchaCheck);
            // next(
            //     Requester.internalError(res, "Error with your reCaptcha response")
            // );
        } else {
            return this.claimReviewService.create({
                ...createClaimReview,
                user: req?.user?._id,
            });
        }
    }

    @IsPublic()
    @Get(":id")
    get(@Param() params) {
        return this.claimReviewService.getById(params.id);
    }

    @Delete(":id")
    delete(@Param() params) {
        return this.claimReviewService.delete(params.id);
    }
}
