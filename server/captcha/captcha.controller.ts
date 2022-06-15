import { HttpService } from "@nestjs/axios";
import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as qs from "querystring";

import { ValidateCaptchaDto } from "./dto/validate-captcha.dto";

@Controller("api/validate-captcha")
export class CaptchaController {
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
        const secret = this.configService.get<string>("recaptcha_secret");
        const recaptchaCheck = await this._checkCaptchaResponse(
            secret,
            validateCaptcha.recaptcha
        );

        console.log("recaptcha check", recaptchaCheck);

        if (recaptchaCheck.success) {
            return { success: true };
        } else {
            return { success: false };
        }
    }
}
