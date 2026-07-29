import { Injectable } from "@nestjs/common";
import type { CaptchaClientConfig, CaptchaProvider } from "../captcha.types";

/**
 * Disables captcha verification entirely. Intended for closed / self-hosted
 * deployments that don't need bot protection on public forms — the guide in
 * WRITING-A-PROVIDER.md calls this out explicitly.
 */
@Injectable()
export class NoopCaptchaProvider implements CaptchaProvider {
    readonly name = "none";

    async verify(): Promise<boolean> {
        return true;
    }

    getClientConfig(): CaptchaClientConfig {
        return { provider: this.name };
    }
}
