import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { createCaptchaProvider } from "./captcha-provider.factory";
import { NoopCaptchaProvider } from "./providers/noop-captcha.provider";
import { RecaptchaProvider } from "./providers/recaptcha.provider";

function configFrom(values: Record<string, unknown>) {
    return { get: (key: string) => values[key] } as unknown as ConfigService;
}

const httpStub = {} as HttpService;

describe("createCaptchaProvider (Unit)", () => {
    it("returns RecaptchaProvider by default when captcha.provider is unset", () => {
        const provider = createCaptchaProvider(configFrom({}), httpStub);

        expect(provider).toBeInstanceOf(RecaptchaProvider);
        expect(provider.name).toBe("recaptcha");
    });

    it("returns RecaptchaProvider when captcha.provider is explicitly 'recaptcha'", () => {
        const provider = createCaptchaProvider(
            configFrom({ "captcha.provider": "recaptcha" }),
            httpStub
        );

        expect(provider).toBeInstanceOf(RecaptchaProvider);
    });

    it("returns NoopCaptchaProvider when captcha.provider is 'none'", () => {
        const provider = createCaptchaProvider(
            configFrom({ "captcha.provider": "none" }),
            httpStub
        );

        expect(provider).toBeInstanceOf(NoopCaptchaProvider);
        expect(provider.name).toBe("none");
    });

    it("falls back to RecaptchaProvider for an unrecognized provider value", () => {
        const provider = createCaptchaProvider(
            configFrom({ "captcha.provider": "altcha" }),
            httpStub
        );

        expect(provider).toBeInstanceOf(RecaptchaProvider);
    });
});
