import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CaptchaService {
    private readonly logger = new Logger("CaptchaService");
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {}

    async _checkCaptchaResponse(secret, response) {
        const RECAPTCHA_API_URL = "https://www.google.com/recaptcha/api";
        const querystring = new URLSearchParams({
            secret,
            response,
        }).toString();
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${RECAPTCHA_API_URL}/siteverify`,
                querystring
            )
        );

        return data;
    }

    async validate(recaptchaString: string) {
        try {
            const secret = this.configService.get<string>("recaptcha_secret");
            const captchaVerification = await this._checkCaptchaResponse(
                secret,
                recaptchaString
            );
            return captchaVerification.success;
        } catch (err) {
            this.logger.error(`error/recaptcha ${err} `);
            return false;
        }
    }
}
