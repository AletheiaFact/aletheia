import { resolveCaptchaRenderMode } from "./AletheiaCaptcha";

describe("resolveCaptchaRenderMode (Unit)", () => {
    it("returns 'recaptcha' when provider is 'recaptcha'", () => {
        expect(resolveCaptchaRenderMode("recaptcha")).toBe("recaptcha");
    });

    it("returns 'none' when provider is 'none'", () => {
        expect(resolveCaptchaRenderMode("none")).toBe("none");
    });

    it("falls back to 'recaptcha' for an unknown provider value", () => {
        expect(resolveCaptchaRenderMode("altcha")).toBe("recaptcha");
    });

    it("falls back to 'recaptcha' when provider is undefined", () => {
        expect(resolveCaptchaRenderMode(undefined)).toBe("recaptcha");
    });
});
