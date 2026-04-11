import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { M2MGuard } from "./m2m.guard";
import { mockAuthConfigService } from "../mocks/AuthMock";

// Mock @ory/client. Variables referenced inside a vi.mock() factory must be
// declared via vi.hoisted() because vi.mock() is hoisted above all imports
// during the Vitest transform pipeline. Constructor mocks must use `function`
// (not arrow functions) so `new Configuration(...)` works under Vitest 4.
const { mockIntrospectOAuth2Token } = vi.hoisted(() => ({
    mockIntrospectOAuth2Token: vi.fn(),
}));

vi.mock("@ory/client", () => ({
    Configuration: vi.fn().mockImplementation(function () {
        return {};
    }),
    OAuth2Api: vi.fn().mockImplementation(function () {
        return { introspectOAuth2Token: mockIntrospectOAuth2Token };
    }),
}));

describe("M2MGuard", () => {
    let guard: M2MGuard;

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

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                M2MGuard,
                { provide: ConfigService, useValue: configService },
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
    });

    it("should return false when authorization header has no Bearer token", async () => {
        const { context } = createMockContext("Basic abc123");
        const result = await guard.canActivate(context);
        expect(result).toBe(false);
    });

    it("should return true and set request.user for valid active M2M token", async () => {
        mockIntrospectOAuth2Token.mockResolvedValue({
            data: {
                active: true,
                client_id: "m2m-client-id",
                sub: "m2m-client-id",
                scope: "read write",
            },
        });

        const { context, request } = createMockContext("Bearer valid-token");

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(request.user).toEqual(
            expect.objectContaining({
                isM2M: true,
                clientId: "m2m-client-id",
                subject: "m2m-client-id",
                scopes: ["read", "write"],
                role: { main: "integration" },
            })
        );
    });

    it("should return false when token is not active", async () => {
        mockIntrospectOAuth2Token.mockResolvedValue({
            data: { active: false },
        });

        const { context } = createMockContext("Bearer inactive-token");
        const result = await guard.canActivate(context);
        expect(result).toBe(false);
    });

    it("should return false when introspection fails", async () => {
        mockIntrospectOAuth2Token.mockRejectedValue(
            new Error("Hydra unavailable")
        );

        const { context } = createMockContext("Bearer error-token");
        const result = await guard.canActivate(context);
        expect(result).toBe(false);
    });

    it("should identify non-M2M tokens when sub differs from client_id", async () => {
        mockIntrospectOAuth2Token.mockResolvedValue({
            data: {
                active: true,
                client_id: "client-id",
                sub: "user-subject",
                scope: "openid",
            },
        });

        const { context, request } = createMockContext("Bearer user-token");

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(request.user.isM2M).toBe(false);
    });
});
