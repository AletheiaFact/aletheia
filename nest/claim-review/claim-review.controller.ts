import { Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { ClaimReviewService } from "./claim-review.service";
import qs from "querystring";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";

@Controller("claim-review")
export class ClaimReviewController {
    constructor(
        private claimReviewService: ClaimReviewService,
        private configService: ConfigService,
        private httpService: HttpService
    ) {}

    async _checkCaptchaResponse(secret, response) {
        const RECAPTCHA_API_URL = "https://www.google.com/recaptcha/api";
        return this.httpService.post(
            `${RECAPTCHA_API_URL}/siteverify`,
            qs.stringify({
                secret,
                response,
            })
        );
    }

    @Post()
    async create(@Req() req) {
        const recaptchaCheck = await this._checkCaptchaResponse(
            this.configService.get<string>("recaptcha_secret"),
            req.body && req.body.recaptcha
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
                ...req.body,
                user: req.user._id,
            });
        }
    }

    @Get(":id")
    get(@Param() params) {
        return this.claimReviewService.getById(params.id);
    }

    @Delete(":id")
    delete(@Param() params) {
        return this.claimReviewService.delete(params.id);
    }
}
