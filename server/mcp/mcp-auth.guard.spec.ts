import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { McpAuthGuard } from "./mcp-auth.guard";
import OryService from "../auth/ory/ory.service";

const mockIntrospect = vi.hoisted(() => vi.fn());

vi.mock("@ory/client", () => ({
    Configuration: vi.fn().mockImplementation(function () {
        return {};
    }),
    OAuth2Api: vi.fn().mockImplementation(function () {
        return { introspectOAuth2Token: mockIntrospect };
    }),
}));

const configValues: Record<string, any> = {
    "ory.hydra.url": "http://hydra",
    "ory.url": "http://ory",
    "ory.access_token": "ory-admin-token",
    app_affiliation: "aletheia",
    "mcp.public_url": "https://aletheiafact.org",
};

const mockGetIdentity = vi.fn();

function createMockContext(authorization?: string) {
    const request: any = { headers: {} };
    if (authorization) request.headers.authorization = authorization;
    const response: any = { setHeader: vi.fn() };
    const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: () => ({
            getRequest: () => request,
            getResponse: () => response,
        }),
    } as unknown as ExecutionContext;
    return { context, request, response };
}

describe("McpAuthGuard", () => {
    let guard: McpAuthGuard;

    beforeEach(async () => {
        vi.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                McpAuthGuard,
                {
                    provide: ConfigService,
                    useValue: { get: vi.fn((k: string) => configValues[k]) },
                },
                Reflector,
                {
                    provide: OryService,
                    useValue: { getIdentity: mockGetIdentity },
                },
            ],
        }).compile();
        guard = module.get(McpAuthGuard);
    });

    it("rejects requests without a bearer token with a WWW-Authenticate challenge", async () => {
        const { context, response } = createMockContext();
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
        expect(response.setHeader).toHaveBeenCalledWith(
            "WWW-Authenticate",
            'Bearer resource_metadata="https://aletheiafact.org/.well-known/oauth-protected-resource/server/mcp"'
        );
    });

    it("rejects inactive tokens", async () => {
        mockIntrospect.mockResolvedValue({ data: { active: false } });
        const { context } = createMockContext("Bearer expired");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("keeps integration role for machine tokens (sub === client_id)", async () => {
        mockIntrospect.mockResolvedValue({
            data: {
                active: true,
                client_id: "client-1",
                sub: "client-1",
                scope: "read write",
            },
        });
        const { context, request } = createMockContext("Bearer m2m-token");
        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(request.user.isM2M).toBe(true);
        expect(request.user.role).toEqual({ main: "integration" });
        expect(mockGetIdentity).not.toHaveBeenCalled();
    });

    it("resolves user tokens to the real Kratos identity and role", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-9" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-9",
            state: "active",
            traits: {
                user_id: "62585756d665dc7bf4b14aa3",
                role: { main: "admin" },
                app_affiliation: "aletheia",
            },
        });
        const { context, request } = createMockContext("Bearer user-token-a");
        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(mockGetIdentity).toHaveBeenCalledWith("identity-9");
        expect(request.user).toEqual({
            isM2M: false,
            _id: "62585756d665dc7bf4b14aa3",
            id: "62585756d665dc7bf4b14aa3",
            role: { main: "admin" },
            status: "active",
        });
    });

    it("rejects identities with a mismatched app affiliation", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-2" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-2",
            state: "active",
            traits: {
                user_id: "u2",
                role: { main: "admin" },
                app_affiliation: "other-app",
            },
        });
        const { context } = createMockContext("Bearer user-token-b");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("caches successful introspections per token", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-9" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-9",
            state: "active",
            traits: {
                user_id: "u9",
                role: { main: "fact-checker" },
                app_affiliation: "aletheia",
            },
        });
        const first = createMockContext("Bearer user-token-c");
        const second = createMockContext("Bearer user-token-c");
        await guard.canActivate(first.context);
        await guard.canActivate(second.context);
        expect(mockIntrospect).toHaveBeenCalledTimes(1);
        expect(second.request.user.role).toEqual({ main: "fact-checker" });
    });
});
