import { Inject, Injectable } from "@nestjs/common";
import { CAPTCHA_PROVIDER } from "./captcha.tokens";
import type { CaptchaClientConfig, CaptchaProvider } from "./captcha.types";

@Injectable()
export class CaptchaService {
    constructor(
        @Inject(CAPTCHA_PROVIDER)
        private readonly captchaProvider: CaptchaProvider
    ) {}

    validate(token: string): Promise<boolean> {
        return this.captchaProvider.verify(token);
    }

    getClientConfig(): CaptchaClientConfig {
        return this.captchaProvider.getClientConfig();
    }

    getChallenge(): Promise<unknown> | undefined {
        return this.captchaProvider.getChallenge?.();
    }
}
