import { NoopCaptchaProvider } from "./noop-captcha.provider";

describe("NoopCaptchaProvider (Unit)", () => {
    it("has name 'none'", () => {
        expect(new NoopCaptchaProvider().name).toBe("none");
    });

    it("verify() always resolves true, regardless of input", async () => {
        const provider = new NoopCaptchaProvider();

        expect(await provider.verify("anything")).toBe(true);
        expect(await provider.verify("")).toBe(true);
    });

    it("getClientConfig() returns only { provider: 'none' } — no sitekey", () => {
        expect(new NoopCaptchaProvider().getClientConfig()).toEqual({
            provider: "none",
        });
    });
});
