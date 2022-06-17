import { HttpService } from "@nestjs/axios";
import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as qs from "querystring";

import { ValidateCaptchaDto } from "./dto/validate-captcha.dto";

@Controller("api/validate-captcha")
export class CaptchaController {
    private readonly logger = new Logger("ClaimController");
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {}

    async _checkCaptchaResponse(secret, response) {
        const RECAPTCHA_API_URL = "https://www.google.com/recaptcha/api";
        const { data } = await this.httpService
            .post(
                `${RECAPTCHA_API_URL}/siteverify`,
                qs.stringify({
                    secret,
                    response,
                })
            )
            .toPromise();

        return data;
    }

    @Post()
    async validate(@Body() validateCaptcha: ValidateCaptchaDto) {
        try {
            const secret = this.configService.get<string>("recaptcha_secret");
            return await this._checkCaptchaResponse(
                secret,
                validateCaptcha.recaptcha
            );
        } catch (err) {
            this.logger.error(`error/recaptcha ${err}`);

            throw Error();
        }
    }
}
