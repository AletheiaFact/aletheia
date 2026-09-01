/**
 * REFERENCE EXAMPLE — excluded from the TypeScript build (see the
 * `*.example.ts` entries in server/tsconfig.json and the root tsconfig.json
 * `exclude` arrays). Not imported anywhere in core, adds no dependency, and
 * is never type-checked or run by CI.
 *
 * A worked, end-to-end CaptchaProvider for ALTCHA (https://altcha.org), a
 * self-hosted, open, privacy-friendly proof-of-work captcha with no external
 * verification service, to illustrate what an "open provider" wired into
 * this abstraction looks like. To actually use it:
 *
 *   1. `yarn add altcha-lib`
 *   2. Copy this file to `server/captcha/providers/altcha.provider.ts`
 *      (dropping the `.example` suffix re-enters it into the build).
 *   3. Add a `case "altcha":` branch to `createCaptchaProvider` in
 *      `server/captcha/captcha-provider.factory.ts`.
 *   4. Add `captcha.altcha.hmac_key` to your config.
 *
 * See server/captcha/WRITING-A-PROVIDER.md for the full walkthrough. The
 * altcha-lib API used below (createChallenge/verifySolution) reflects the
 * package's documented server-side API at the time this example was
 * written — since this file is excluded from the build and never
 * type-checked, confirm it against your installed altcha-lib version's docs
 * before relying on it.
 */
import { createChallenge, verifySolution } from "altcha-lib";
import type { ConfigService } from "@nestjs/config";
import type { CaptchaClientConfig, CaptchaProvider } from "../captcha.types";

export class AltchaCaptchaProvider implements CaptchaProvider {
    readonly name = "altcha";

    constructor(private readonly configService: ConfigService) {}

    private resolveHmacKey(): string {
        const key = this.configService.get<string>("captcha.altcha.hmac_key");
        if (!key) {
            throw new Error(
                "AltchaCaptchaProvider requires captcha.altcha.hmac_key to be configured."
            );
        }
        return key;
    }

    /** Issues a fresh proof-of-work challenge for the widget to solve. */
    async getChallenge(): Promise<unknown> {
        return createChallenge({
            hmacKey: this.resolveHmacKey(),
            maxNumber: 100000,
        });
    }

    /** Verifies the solved-challenge payload the widget posts back. */
    async verify(payload: string): Promise<boolean> {
        try {
            return await verifySolution(payload, this.resolveHmacKey());
        } catch {
            return false;
        }
    }

    /**
     * ALTCHA has no sitekey — the widget fetches its own challenge from
     * GET /api/captcha/challenge (see CaptchaController), so only
     * challengeUrl is needed on the client.
     */
    getClientConfig(): CaptchaClientConfig {
        return { provider: this.name, challengeUrl: "/api/captcha/challenge" };
    }
}
