import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { of } from "rxjs";
import { RecaptchaProvider } from "./recaptcha.provider";

function configFrom(values: Record<string, unknown>) {
    return { get: (key: string) => values[key] } as unknown as ConfigService;
}

function httpServiceReturning(data: unknown) {
    return {
        post: vi.fn().mockReturnValue(of({ data })),
    } as unknown as HttpService;
}

describe("RecaptchaProvider (Unit)", () => {
    async function build(values: Record<string, unknown>, http: HttpService) {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                RecaptchaProvider,
                { provide: HttpService, useValue: http },
                { provide: ConfigService, useValue: configFrom(values) },
            ],
        }).compile();
        return moduleRef.get(RecaptchaProvider);
    }

    it("has name 'recaptcha'", async () => {
        const provider = await build(
            {},
            httpServiceReturning({ success: true })
        );
        expect(provider.name).toBe("recaptcha");
    });

    it("verify() posts to the Google siteverify endpoint and returns true on success", async () => {
        const http = httpServiceReturning({ success: true });
        const provider = await build(
            { recaptcha_secret: "legacy-secret" },
            http
        );

        const result = await provider.verify("token-123");

        expect(result).toBe(true);
        expect(http.post).toHaveBeenCalledWith(
            "https://www.google.com/recaptcha/api/siteverify",
            new URLSearchParams({
                secret: "legacy-secret",
                response: "token-123",
            }).toString()
        );
    });

    it("verify() returns false when siteverify reports failure", async () => {
        const provider = await build(
            {},
            httpServiceReturning({ success: false })
        );
        expect(await provider.verify("bad-token")).toBe(false);
    });

    it("verify() returns false and swallows network errors", async () => {
        const http = {
            post: vi.fn().mockImplementation(() => {
                throw new Error("network down");
            }),
        } as unknown as HttpService;
        const provider = await build({}, http);

        expect(await provider.verify("token")).toBe(false);
    });

    it("prefers captcha.recaptcha.secret over the legacy recaptcha_secret", async () => {
        const http = httpServiceReturning({ success: true });
        const provider = await build(
            {
                "captcha.recaptcha.secret": "new-secret",
                recaptcha_secret: "legacy-secret",
            },
            http
        );

        await provider.verify("token");

        expect(http.post).toHaveBeenCalledWith(
            expect.any(String),
            new URLSearchParams({
                secret: "new-secret",
                response: "token",
            }).toString()
        );
    });

    it("getClientConfig() returns provider + sitekey, preferring captcha.recaptcha.sitekey", async () => {
        const provider = await build(
            {
                "captcha.recaptcha.sitekey": "new-sitekey",
                recaptcha_sitekey: "legacy-sitekey",
            },
            httpServiceReturning({ success: true })
        );

        expect(provider.getClientConfig()).toEqual({
            provider: "recaptcha",
            sitekey: "new-sitekey",
        });
    });

    it("getClientConfig() falls back to the legacy recaptcha_sitekey", async () => {
        const provider = await build(
            { recaptcha_sitekey: "legacy-sitekey" },
            httpServiceReturning({ success: true })
        );

        expect(provider.getClientConfig()).toEqual({
            provider: "recaptcha",
            sitekey: "legacy-sitekey",
        });
    });
});
