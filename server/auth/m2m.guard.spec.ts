import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { M2MGuard } from "./m2m.guard";
import { TokenIdentityService } from "./token-identity.service";
import { mockAuthConfigService } from "../mocks/AuthMock";

describe("M2MGuard", () => {
    let guard: M2MGuard;
    let tokenIdentity: { resolveBearerToken: ReturnType<typeof vi.fn> };

    const createMockContext = (authHeader?: string) => {
        const request: any = {
            headers: { authorization: authHeader },
            params: {},
        };
        const context = {
            getHandler: vi.fn(),
            getClass: vi.fn(),
            switchToHttp: () => ({
                getRequest: () => request,
                getResponse: () => ({}),
            }),
        } as unknown as ExecutionContext;
        return { context, request };
    };

    beforeAll(async () => {
        const configService = mockAuthConfigService();
        tokenIdentity = { resolveBearerToken: vi.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                M2MGuard,
                { provide: ConfigService, useValue: configService },
                { provide: TokenIdentityService, useValue: tokenIdentity },
                Reflector,
            ],
        }).compile();

        guard = module.get<M2MGuard>(M2MGuard);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return false when no authorization header is present", async () => {
        const { context } = createMockContext(undefined);
        const result = await guard.canActivate(context);
        expect(result).toBe(false);
        expect(tokenIdentity.resolveBearerToken).not.toHaveBeenCalled();
    });

    it("should return false when authorization header has no Bearer token", async () => {
        const { context } = createMockContext("Basic abc123");
        const result = await guard.canActivate(context);
        expect(result).toBe(false);
        expect(tokenIdentity.resolveBearerToken).not.toHaveBeenCalled();
    });

    it("should return false when resolveBearerToken resolves null", async () => {
        tokenIdentity.resolveBearerToken.mockResolvedValue(null);

        const { context } = createMockContext("Bearer invalid-token");
        const result = await guard.canActivate(context);

        expect(tokenIdentity.resolveBearerToken).toHaveBeenCalledWith(
            "invalid-token"
        );
        expect(result).toBe(false);
    });

    it("should return true and set request.user for a resolved M2M user", async () => {
        const m2mUser = {
            isM2M: true,
            clientId: "m2m-client-id",
            subject: "m2m-client-id",
            scopes: ["read", "write"],
            role: { main: "integration" },
            namespace: "main",
        };
        tokenIdentity.resolveBearerToken.mockResolvedValue(m2mUser);

        const { context, request } = createMockContext("Bearer valid-token");

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(request.user).toEqual(m2mUser);
    });

    it("should return true and set request.user for a resolved real user (non-integration role)", async () => {
        const realUser = {
            isM2M: false,
            _id: "u1",
            id: "u1",
            role: { main: "admin" },
            status: "active",
        };
        tokenIdentity.resolveBearerToken.mockResolvedValue(realUser);

        const { context, request } = createMockContext("Bearer user-token");

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(request.user).toEqual(realUser);
    });
});
