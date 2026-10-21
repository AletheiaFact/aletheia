import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { McpOAuthProviderService } from "./mcp-oauth-provider.service";

const hydra = {
    getOAuth2LoginRequest: vi.fn(),
    acceptOAuth2LoginRequest: vi.fn(),
    getOAuth2ConsentRequest: vi.fn(),
    acceptOAuth2ConsentRequest: vi.fn(),
    rejectOAuth2ConsentRequest: vi.fn(),
};

vi.mock("@ory/client", () => ({
    Configuration: vi.fn(),
    OAuth2Api: vi.fn(function () {
        return hydra;
    }),
}));

describe("McpOAuthProviderService", () => {
    const configService = { get: vi.fn() } as any;
    const oryService = { whoAmI: vi.fn() } as any;
    let service: McpOAuthProviderService;

    const signedInAs = (id: string) =>
        oryService.whoAmI.mockResolvedValue({ identity: { id } });
    const signedOut = () => oryService.whoAmI.mockRejectedValue(new Error());

    beforeEach(() => {
        vi.clearAllMocks();
        service = new McpOAuthProviderService(configService, oryService);
    });

    describe("resolveLogin", () => {
        beforeEach(() =>
            hydra.getOAuth2LoginRequest.mockResolvedValue({
                data: { skip: false },
            })
        );

        it("sends signed-out users to login, returning to the challenge", async () => {
            signedOut();
            const selfUrl = "http://127.0.0.1:3000/api/mcp/oauth/login?x=1";

            const redirect = await service.resolveLogin("c", "cookie", selfUrl);

            expect(redirect).toBe(
                `/login?return_to=${encodeURIComponent(selfUrl)}`
            );
            expect(hydra.acceptOAuth2LoginRequest).not.toHaveBeenCalled();
        });

        it("accepts the login for the signed-in identity", async () => {
            signedInAs("identity-1");
            hydra.acceptOAuth2LoginRequest.mockResolvedValue({
                data: { redirect_to: "http://hydra/continue" },
            });

            const redirect = await service.resolveLogin("c", "cookie", "self");

            expect(redirect).toBe("http://hydra/continue");
            expect(hydra.acceptOAuth2LoginRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    loginChallenge: "c",
                    acceptOAuth2LoginRequest: expect.objectContaining({
                        subject: "identity-1",
                    }),
                })
            );
        });
    });

    describe("consent", () => {
        beforeEach(() =>
            hydra.getOAuth2ConsentRequest.mockResolvedValue({
                data: {
                    subject: "identity-1",
                    client: { client_name: "Claude Code" },
                    requested_scope: ["openid", "offline_access"],
                    requested_access_token_audience: [],
                },
            })
        );

        it("rejects when there is no session", async () => {
            signedOut();
            await expect(service.getConsent("c", undefined)).rejects.toThrow(
                UnauthorizedException
            );
        });

        it("rejects a consent request owned by another identity", async () => {
            signedInAs("someone-else");
            await expect(service.getConsent("c", "cookie")).rejects.toThrow(
                ForbiddenException
            );
            await expect(
                service.decideConsent("c", "accept", "cookie")
            ).rejects.toThrow(ForbiddenException);
            expect(hydra.acceptOAuth2ConsentRequest).not.toHaveBeenCalled();
        });

        it("summarises the client and scopes for the owner", async () => {
            signedInAs("identity-1");
            await expect(service.getConsent("c", "cookie")).resolves.toEqual({
                clientName: "Claude Code",
                scopes: ["openid", "offline_access"],
            });
        });

        it("grants the requested scopes on accept", async () => {
            signedInAs("identity-1");
            hydra.acceptOAuth2ConsentRequest.mockResolvedValue({
                data: { redirect_to: "http://hydra/done" },
            });

            const redirect = await service.decideConsent("c", "accept", "ck");

            expect(redirect).toBe("http://hydra/done");
            expect(hydra.acceptOAuth2ConsentRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    consentChallenge: "c",
                    acceptOAuth2ConsentRequest: expect.objectContaining({
                        grant_scope: ["openid", "offline_access"],
                    }),
                })
            );
        });

        it("reports access_denied on reject", async () => {
            signedInAs("identity-1");
            hydra.rejectOAuth2ConsentRequest.mockResolvedValue({
                data: { redirect_to: "http://hydra/denied" },
            });

            const redirect = await service.decideConsent("c", "reject", "ck");

            expect(redirect).toBe("http://hydra/denied");
            expect(hydra.rejectOAuth2ConsentRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    rejectOAuth2Request: expect.objectContaining({
                        error: "access_denied",
                    }),
                })
            );
        });
    });
});
