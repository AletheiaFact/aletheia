import { Test, TestingModule } from "@nestjs/testing";
import { CaptchaService } from "./captcha.service";
import { CAPTCHA_PROVIDER } from "./captcha.tokens";
import type { CaptchaProvider } from "./captcha.types";

describe("CaptchaService (Unit)", () => {
    function buildProvider(
        overrides: Partial<CaptchaProvider> = {}
    ): CaptchaProvider {
        return {
            name: "stub",
            verify: vi.fn().mockResolvedValue(true),
            getClientConfig: vi.fn().mockReturnValue({ provider: "stub" }),
            ...overrides,
        };
    }

    async function build(provider: CaptchaProvider) {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CaptchaService,
                { provide: CAPTCHA_PROVIDER, useValue: provider },
            ],
        }).compile();
        return moduleRef.get(CaptchaService);
    }

    it("validate() delegates to the injected provider's verify()", async () => {
        const provider = buildProvider({
            verify: vi.fn().mockResolvedValue(true),
        });
        const service = await build(provider);

        expect(await service.validate("token-123")).toBe(true);
        expect(provider.verify).toHaveBeenCalledWith("token-123");
    });

    it("validate() propagates a false verification result", async () => {
        const provider = buildProvider({
            verify: vi.fn().mockResolvedValue(false),
        });
        const service = await build(provider);

        expect(await service.validate("bad-token")).toBe(false);
    });

    it("getClientConfig() delegates to the injected provider", async () => {
        const provider = buildProvider({
            getClientConfig: vi
                .fn()
                .mockReturnValue({ provider: "stub", sitekey: "abc" }),
        });
        const service = await build(provider);

        expect(service.getClientConfig()).toEqual({
            provider: "stub",
            sitekey: "abc",
        });
    });

    it("getChallenge() resolves undefined when the provider has no getChallenge", async () => {
        const provider = buildProvider();
        const service = await build(provider);

        expect(await service.getChallenge()).toBeUndefined();
    });

    it("getChallenge() delegates when the provider implements it", async () => {
        const provider = buildProvider({
            getChallenge: vi.fn().mockResolvedValue({ challenge: "xyz" }),
        });
        const service = await build(provider);

        expect(await service.getChallenge()).toEqual({ challenge: "xyz" });
        expect(provider.getChallenge).toHaveBeenCalled();
    });
});
