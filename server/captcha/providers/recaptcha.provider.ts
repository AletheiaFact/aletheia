import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import type { CaptchaClientConfig, CaptchaProvider } from "../captcha.types";

@Injectable()
export class RecaptchaProvider implements CaptchaProvider {
    readonly name = "recaptcha";
    private readonly logger = new Logger("RecaptchaProvider");

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    private resolveSecret(): string {
        return (
            this.configService.get<string>("captcha.recaptcha.secret") ??
            this.configService.get<string>("recaptcha_secret") ??
            ""
        );
    }

    private resolveSitekey(): string | undefined {
        return (
            this.configService.get<string>("captcha.recaptcha.sitekey") ??
            this.configService.get<string>("recaptcha_sitekey")
        );
    }

    private async checkCaptchaResponse(secret: string, response: string) {
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

    async verify(token: string): Promise<boolean> {
        try {
            const captchaVerification = await this.checkCaptchaResponse(
                this.resolveSecret(),
                token
            );
            return captchaVerification.success;
        } catch (err) {
            this.logger.error(`error/recaptcha ${err} `);
            return false;
        }
    }

    getClientConfig(): CaptchaClientConfig {
        return { provider: this.name, sitekey: this.resolveSitekey() };
    }
}
