import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CaptchaController } from "./captcha.controller";
import { CaptchaService } from "./captcha.service";

describe("CaptchaController (Unit)", () => {
    function build(captchaServiceOverrides: Partial<CaptchaService> = {}) {
        return Test.createTestingModule({
            controllers: [CaptchaController],
            providers: [
                { provide: ConfigService, useValue: { get: () => undefined } },
                {
                    provide: CaptchaService,
                    useValue: {
                        getClientConfig: vi
                            .fn()
                            .mockReturnValue({
                                provider: "recaptcha",
                                sitekey: "abc",
                            }),
                        getChallenge: vi.fn().mockResolvedValue(undefined),
                        ...captchaServiceOverrides,
                    },
                },
            ],
        }).compile();
    }

    it("GET /api/captcha/config returns the active provider's client config", async () => {
        const moduleRef: TestingModule = await build();
        const controller = moduleRef.get(CaptchaController);

        expect(controller.getConfig()).toEqual({
            provider: "recaptcha",
            sitekey: "abc",
        });
    });

    it("GET /api/captcha/challenge returns the provider's challenge when supported", async () => {
        const moduleRef: TestingModule = await build({
            getChallenge: vi.fn().mockResolvedValue({ challenge: "xyz" }),
        });
        const controller = moduleRef.get(CaptchaController);

        expect(await controller.getChallengeEndpoint()).toEqual({
            challenge: "xyz",
        });
    });

    it("GET /api/captcha/challenge throws NotFoundException when the provider has no challenge", async () => {
        const moduleRef: TestingModule = await build({
            getChallenge: vi.fn().mockResolvedValue(undefined),
        });
        const controller = moduleRef.get(CaptchaController);

        await expect(controller.getChallengeEndpoint()).rejects.toThrow(
            NotFoundException
        );
    });
});
