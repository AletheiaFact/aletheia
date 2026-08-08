import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { NoopCaptchaProvider } from "./providers/noop-captcha.provider";
import { RecaptchaProvider } from "./providers/recaptcha.provider";
import type { CaptchaProvider } from "./captcha.types";

/**
 * Selects the CaptchaProvider implementation from `captcha.provider` config,
 * defaulting to "recaptcha" when unset so existing deployments are
 * unaffected. This switch is the single, documented place a deployer adds a
 * `case` for their own provider — see server/captcha/WRITING-A-PROVIDER.md
 * and the ALTCHA reference example.
 */
export function createCaptchaProvider(
    config: ConfigService,
    http: HttpService
): CaptchaProvider {
    switch (config.get<string>("captcha.provider") ?? "recaptcha") {
        case "none":
            return new NoopCaptchaProvider();
        default:
            return new RecaptchaProvider(http, config);
    }
}
