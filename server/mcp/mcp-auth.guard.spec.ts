import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { McpAuthGuard } from "./mcp-auth.guard";
import { TokenIdentityService } from "../auth/token-identity.service";

const configValues: Record<string, any> = {
    "ory.hydra.url": "http://hydra",
    "ory.url": "http://ory",
    "ory.access_token": "ory-admin-token",
    app_affiliation: "aletheia",
    "mcp.public_url": "https://aletheiafact.org",
};

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
    let tokenIdentity: { resolveBearerToken: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        vi.clearAllMocks();
        tokenIdentity = { resolveBearerToken: vi.fn() };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                McpAuthGuard,
                {
                    provide: ConfigService,
                    useValue: { get: vi.fn((k: string) => configValues[k]) },
                },
                Reflector,
                { provide: TokenIdentityService, useValue: tokenIdentity },
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
        expect(tokenIdentity.resolveBearerToken).not.toHaveBeenCalled();
    });

    it("rejects when resolveBearerToken resolves null with a WWW-Authenticate challenge", async () => {
        tokenIdentity.resolveBearerToken.mockResolvedValue(null);
        const { context, response } = createMockContext("Bearer expired");
        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        );
        expect(response.setHeader).toHaveBeenCalledWith(
            "WWW-Authenticate",
            'Bearer resource_metadata="https://aletheiafact.org/.well-known/oauth-protected-resource/api/mcp"'
        );
    });

    it("sets request.user and returns true for a resolved user", async () => {
        const user = {
            isM2M: false,
            _id: "62585756d665dc7bf4b14aa3",
            id: "62585756d665dc7bf4b14aa3",
            role: { main: "admin" },
            status: "active",
        };
        tokenIdentity.resolveBearerToken.mockResolvedValue(user);
        const { context, request } = createMockContext("Bearer user-token-a");
        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(request.user).toEqual(user);
    });

    it("caches successful resolutions per token, calling resolveBearerToken only once", async () => {
        const user = {
            isM2M: false,
            _id: "u9",
            id: "u9",
            role: { main: "fact-checker" },
            status: "active",
        };
        tokenIdentity.resolveBearerToken.mockResolvedValue(user);
        const first = createMockContext("Bearer user-token-c");
        const second = createMockContext("Bearer user-token-c");
        await guard.canActivate(first.context);
        await guard.canActivate(second.context);
        expect(tokenIdentity.resolveBearerToken).toHaveBeenCalledTimes(1);
        expect(second.request.user).toEqual(user);
        // Raw bearer tokens must never be used as cache keys.
        expect((guard as any).cache.has("user-token-c")).toBe(false);
        expect((guard as any).cache.size).toBe(1);
    });

    it("re-resolves tokens after the cache TTL expires", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
        tokenIdentity.resolveBearerToken.mockResolvedValue({
            isM2M: false,
            _id: "u9",
            id: "u9",
            role: { main: "fact-checker" },
            status: "active",
        });
        const first = createMockContext("Bearer user-token-f");
        const second = createMockContext("Bearer user-token-f");
        await guard.canActivate(first.context);
        vi.advanceTimersByTime(McpAuthGuard.CACHE_TTL_MS + 1);
        await guard.canActivate(second.context);
        expect(tokenIdentity.resolveBearerToken).toHaveBeenCalledTimes(2);
    });

    it("evicts expired entries from the cache on write", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
        tokenIdentity.resolveBearerToken.mockResolvedValue({
            isM2M: false,
            _id: "u9",
            id: "u9",
            role: { main: "fact-checker" },
            status: "active",
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
