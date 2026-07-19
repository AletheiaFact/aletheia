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

    afterEach(() => {
        vi.useRealTimers();
    });

    it("rejects requests without a bearer token with a WWW-Authenticate challenge", async () => {
        const { context, response } = createMockContext();
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
        expect(response.setHeader).toHaveBeenCalledWith(
            "WWW-Authenticate",
            'Bearer resource_metadata="https://aletheiafact.org/.well-known/oauth-protected-resource/api/mcp"'
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

    it("rejects when token introspection fails with a network error", async () => {
        mockIntrospect.mockRejectedValue(new Error("Hydra unavailable"));
        const { context, response } = createMockContext("Bearer flaky-token");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
        expect(response.setHeader).toHaveBeenCalledWith(
            "WWW-Authenticate",
            'Bearer resource_metadata="https://aletheiafact.org/.well-known/oauth-protected-resource/api/mcp"'
        );
    });

    it("rejects when the identity lookup fails", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-x" },
        });
        mockGetIdentity.mockRejectedValue(
            new Error("Failed to fetch identity identity-x: 404")
        );
        const { context } = createMockContext("Bearer user-token-x");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
    });

    it("rejects identities when app_affiliation config is unset (fails closed)", async () => {
        const previous = configValues.app_affiliation;
        delete configValues.app_affiliation;
        try {
            mockIntrospect.mockResolvedValue({
                data: {
                    active: true,
                    client_id: "mcp-client",
                    sub: "identity-3",
                },
            });
            mockGetIdentity.mockResolvedValue({
                id: "identity-3",
                state: "active",
                traits: {
                    user_id: "u3",
                    role: { main: "admin" },
                },
            });
            const { context } = createMockContext("Bearer user-token-d");
            await expect(guard.canActivate(context)).rejects.toThrow(
                UnauthorizedException
            );
        } finally {
            configValues.app_affiliation = previous;
        }
    });

    it("rejects identities that are not active", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp-client", sub: "identity-4" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "identity-4",
            state: "inactive",
            traits: {
                user_id: "u4",
                role: { main: "admin" },
                app_affiliation: "aletheia",
            },
        });
        const { context } = createMockContext("Bearer user-token-e");
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
        // Raw bearer tokens must never be used as cache keys.
        expect((guard as any).cache.has("user-token-c")).toBe(false);
        expect((guard as any).cache.size).toBe(1);
    });

    it("re-introspects tokens after the cache TTL expires", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
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
        const first = createMockContext("Bearer user-token-f");
        const second = createMockContext("Bearer user-token-f");
        await guard.canActivate(first.context);
        vi.advanceTimersByTime(McpAuthGuard.CACHE_TTL_MS + 1);
        await guard.canActivate(second.context);
        expect(mockIntrospect).toHaveBeenCalledTimes(2);
    });

    it("evicts expired entries from the cache on write", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
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
        const stale = createMockContext("Bearer user-token-stale");
        await guard.canActivate(stale.context);
        expect((guard as any).cache.size).toBe(1);
        vi.advanceTimersByTime(McpAuthGuard.CACHE_TTL_MS + 1);
        // A different token triggers a cache write, which sweeps stale entries.
        const fresh = createMockContext("Bearer user-token-fresh");
        await guard.canActivate(fresh.context);
        expect((guard as any).cache.size).toBe(1);
    });
});
