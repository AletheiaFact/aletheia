import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, ServiceUnavailableException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { FrontendApi } from "@ory/client";
import { ORY_REQUEST_TIMEOUT_MS, SessionGuard } from "./session.guard";
import { UsersService } from "../users/users.service";
import { TokenIdentityService } from "./token-identity.service";
import OryService from "./ory/ory.service";
import {
    createMockSession,
    mockUsersService,
    mockAuthConfigService,
} from "../mocks/AuthMock";
import { Roles } from "./ability/ability.factory";

// Mock @ory/client. Variables referenced inside a vi.mock() factory must be
// declared via vi.hoisted() because vi.mock() is hoisted above all imports
// during the Vitest transform pipeline. Constructor mocks must use `function`
// (not arrow functions) so `new Configuration(...)` works under Vitest 4.
const { mockToSession, mockCreateBrowserLogoutFlow, mockUpdateLogoutFlow } =
    vi.hoisted(() => ({
        mockToSession: vi.fn(),
        mockCreateBrowserLogoutFlow: vi.fn().mockResolvedValue({
            data: { logout_token: "mock-logout-token" },
        }),
        mockUpdateLogoutFlow: vi.fn().mockResolvedValue({}),
    }));

vi.mock("@ory/client", () => ({
    Configuration: vi.fn().mockImplementation(function () {
        return {};
    }),
    FrontendApi: vi.fn().mockImplementation(function () {
        return {
            toSession: mockToSession,
            createBrowserLogoutFlow: mockCreateBrowserLogoutFlow,
            updateLogoutFlow: mockUpdateLogoutFlow,
        };
    }),
}));

// Error shapes raised by the axios bundled in @ory/client.
const oryHttpError = (status: number) =>
    Object.assign(new Error(`Request failed with status code ${status}`), {
        isAxiosError: true,
        response: { status },
    });
const oryNetworkError = (code: string) =>
    Object.assign(new Error(`getaddrinfo ${code} auth.example.org`), {
        isAxiosError: true,
        code,
    });

describe("SessionGuard", () => {
    let guard: SessionGuard;
    let usersService: ReturnType<typeof mockUsersService>;
    let configService: ReturnType<typeof mockAuthConfigService>;

    const createMockContext = (
        cookie = "ory_session=abc",
        isPublic = false,
        url = "/api/test",
        sessionToken?: string
    ) => {
        const mockRedirect = vi.fn();
        const request: any = {
            header: vi.fn((name: string) => {
                if (name === "X-Session-Token") return sessionToken;
                return cookie;
            }),
            url,
            params: {},
        };
        const response = { redirect: mockRedirect };
        const handler = vi.fn();
        if (isPublic) {
            Reflect.defineMetadata("public", true, handler);
        }
        const context = {
            getHandler: vi.fn().mockReturnValue(handler),
            getClass: vi.fn(),
            switchToHttp: () => ({
                getRequest: () => request,
                getResponse: () => response,
            }),
        } as unknown as ExecutionContext;
        return { context, request, response };
    };

    beforeAll(async () => {
        usersService = mockUsersService();
        configService = mockAuthConfigService();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionGuard,
                { provide: UsersService, useValue: usersService },
                { provide: ConfigService, useValue: configService },
                Reflector,
                TokenIdentityService,
                { provide: OryService, useValue: { getIdentity: vi.fn() } },
            ],
        }).compile();

        guard = module.get<SessionGuard>(SessionGuard);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        // Re-apply default config mock after clearAllMocks
        configService.get.mockImplementation((key: string) => {
            const config = {
                authentication_type: "ory",
                "ory.url": "http://localhost:4433",
                "ory.access_token": "mock-access-token",
                "ory.hydra.url": "http://localhost:4445",
                app_affiliation: "aletheia",
                override_public_routes: undefined,
            };
            return config[key];
        });
    });

    const setupDefaultUserMock = () => {
        usersService.getById.mockResolvedValue({
            _id: "mongo-user-id-123",
            name: "Test User",
            role: { main: Roles.Regular },
        });
    };

    describe("valid session", () => {
        it("should grant access and set request.user for valid session", async () => {
            setupDefaultUserMock();
            const session = createMockSession();
            mockToSession.mockResolvedValue({ data: session });

            const { context, request } = createMockContext();

            const result = await guard.canActivate(context);

            expect(result).toBe(true);
            expect(request.user).toEqual(
                expect.objectContaining({
                    _id: "mongo-user-id-123",
                    isM2M: false,
                    role: { main: Roles.Regular },
                })
            );
        });

        it("should set correct user properties from session identity", async () => {
            usersService.getById.mockResolvedValue({
                _id: "admin-user-id",
                name: "Admin User",
                role: { main: Roles.Admin },
            });
            const session = createMockSession({
                traits: {
                    role: { main: Roles.Admin },
                    user_id: "admin-user-id",
                },
            });
            mockToSession.mockResolvedValue({ data: session });

            const { context, request } = createMockContext(
                "ory_session=abc",
                false,
                "/api/admin"
            );

            const result = await guard.canActivate(context);

            expect(result).toBe(true);
            expect(request.user).toBeDefined();
            expect(request.user._id).toBe("admin-user-id");
            expect(request.user.id).toBe("admin-user-id");
            expect(request.user.role).toEqual({ main: Roles.Admin });
        });
    });

    describe("native session token (X-Session-Token)", () => {
        it("should grant access using the session token when no cookie is present", async () => {
            setupDefaultUserMock();
            const session = createMockSession();
            mockToSession.mockResolvedValue({ data: session });

            const { context, request } = createMockContext(
                "",
                false,
                "/api/me",
                "ory_st_native-token"
            );

            const result = await guard.canActivate(context);

            expect(result).toBe(true);
            expect(mockToSession).toHaveBeenCalledWith(
                expect.objectContaining({
                    xSessionToken: "ory_st_native-token",
                }),
                expect.anything()
            );
            expect(request.user).toEqual(
                expect.objectContaining({
                    _id: "mongo-user-id-123",
                    isM2M: false,
                })
            );
        });
    });

    describe("Ory client", () => {
        it("should reuse one FrontendApi across requests", async () => {
            setupDefaultUserMock();
            mockToSession.mockResolvedValue({ data: createMockSession() });
            configService.get.mockImplementation((key: string) => {
                const config = {
                    authentication_type: "ory",
                    "ory.url": "http://reuse.test",
                    "ory.access_token": "mock-access-token",
                    app_affiliation: "aletheia",
                };
                return config[key];
            });

            await guard.canActivate(createMockContext().context);
            await guard.canActivate(createMockContext().context);

            expect(vi.mocked(FrontendApi)).toHaveBeenCalledTimes(1);
        });

        it("should bound the session lookup with a timeout signal", async () => {
            setupDefaultUserMock();
            mockToSession.mockResolvedValue({ data: createMockSession() });
            const timeoutSpy = vi.spyOn(AbortSignal, "timeout");

            await guard.canActivate(createMockContext().context);

            expect(timeoutSpy).toHaveBeenCalledWith(ORY_REQUEST_TIMEOUT_MS);
            expect(mockToSession).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ signal: expect.any(AbortSignal) })
            );
            timeoutSpy.mockRestore();
        });
    });

    describe("invalid session", () => {
        it("should redirect to login when session is expired", async () => {
            mockToSession.mockRejectedValue(oryHttpError(401));

            const { context, response } = createMockContext(
                "ory_session=expired",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(response.redirect).toHaveBeenCalledWith("/login");
            expect(result).toBe(false);
        });

        it("should allow public API routes even without session", async () => {
            mockToSession.mockRejectedValue(oryHttpError(401));

            const { context } = createMockContext(
                "ory_session=expired",
                false,
                "/api/health"
            );

            const result = await guard.canActivate(context);
            expect(result).toBe(true);
        });

        it("should not log an error for an expected 401", async () => {
            const errorSpy = vi
                .spyOn(guard["logger"], "error")
                .mockImplementation(() => undefined);
            mockToSession.mockRejectedValue(oryHttpError(401));

            const result = await guard.canActivate(
                createMockContext("", false, "/api/test").context
            );

            expect(result).toBe(true);
            expect(errorSpy).not.toHaveBeenCalled();
        });

        it("should keep the critical-failure fallback for unexpected errors", async () => {
            const errorSpy = vi
                .spyOn(guard["logger"], "error")
                .mockImplementation(() => undefined);
            mockToSession.mockRejectedValue(new Error("boom"));

            const { context, response } = createMockContext(
                "ory_session=abc",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(response.redirect).toHaveBeenCalledWith("/login");
            expect(result).toBe(false);
            expect(errorSpy).toHaveBeenCalledWith(
                expect.stringContaining("Critical failure in AuthGuard"),
                expect.anything()
            );
        });
    });

    describe("health probe", () => {
        it.each(["/api/health", "/api/health?probe=readiness"])(
            "should allow %s without calling Ory",
            async (url) => {
                mockToSession.mockRejectedValue(oryNetworkError("EAI_AGAIN"));

                const { context, request } = createMockContext("", false, url);

                const result = await guard.canActivate(context);

                expect(result).toBe(true);
                expect(mockToSession).not.toHaveBeenCalled();
                expect(request.user).toBeUndefined();
            }
        );

        it("should still look up the session for other /api/health* paths", async () => {
            vi.spyOn(guard["logger"], "error").mockImplementation(
                () => undefined
            );
            mockToSession.mockRejectedValue(oryHttpError(401));

            await guard.canActivate(
                createMockContext("", false, "/api/healthcheck").context
            );

            expect(mockToSession).toHaveBeenCalled();
        });
    });

    describe("Ory unreachable", () => {
        it.each([
            ["DNS failure", oryNetworkError("EAI_AGAIN")],
            ["connection refused", oryNetworkError("ECONNREFUSED")],
            ["timeout", oryNetworkError("ERR_CANCELED")],
            ["Ory 5xx", oryHttpError(502)],
        ])(
            "should return 503 for a protected API route on %s",
            async (_label, error) => {
                vi.spyOn(guard["logger"], "error").mockImplementation(
                    () => undefined
                );
                mockToSession.mockRejectedValue(error);

                const { context, request } = createMockContext(
                    "ory_session=abc",
                    false,
                    "/api/test"
                );

                await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
                    ServiceUnavailableException
                );
                expect(request.user).toBeUndefined();
            }
        );

        it("should log the transport error code, not a critical failure", async () => {
            const errorSpy = vi
                .spyOn(guard["logger"], "error")
                .mockImplementation(() => undefined);
            mockToSession.mockRejectedValue(oryNetworkError("EAI_AGAIN"));

            await expect(
                guard.canActivate(createMockContext().context)
            ).rejects.toBeInstanceOf(ServiceUnavailableException);

            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy.mock.calls[0][0]).toContain("EAI_AGAIN");
            expect(errorSpy.mock.calls[0][0]).not.toContain("Critical failure");
        });

        it("should let @Public API routes through anonymously", async () => {
            vi.spyOn(guard["logger"], "error").mockImplementation(
                () => undefined
            );
            mockToSession.mockRejectedValue(oryNetworkError("EAI_AGAIN"));

            const { context, request } = createMockContext(
                "ory_session=abc",
                true,
                "/api/test"
            );

            const result = await guard.canActivate(context);

            expect(result).toBe(true);
            expect(request.user).toBeUndefined();
        });

        it("should let allowlisted public API URLs through", async () => {
            vi.spyOn(guard["logger"], "error").mockImplementation(
                () => undefined
            );
            mockToSession.mockRejectedValue(oryNetworkError("EAI_AGAIN"));

            const result = await guard.canActivate(
                createMockContext("ory_session=abc", false, "/api/health")
                    .context
            );

            expect(result).toBe(true);
        });

        it("should still redirect protected pages to /login", async () => {
            vi.spyOn(guard["logger"], "error").mockImplementation(
                () => undefined
            );
            mockToSession.mockRejectedValue(oryNetworkError("EAI_AGAIN"));

            const { context, response } = createMockContext(
                "ory_session=abc",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(response.redirect).toHaveBeenCalledWith("/login");
            expect(result).toBe(false);
        });
    });

    describe("user not found in DB", () => {
        it("should logout and redirect to signup-invite when user not in MongoDB", async () => {
            const session = createMockSession();
            mockToSession.mockResolvedValue({ data: session });
            usersService.getById.mockRejectedValue(new Error("User not found"));

            const { context, response } = createMockContext(
                "ory_session=abc",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(mockCreateBrowserLogoutFlow).toHaveBeenCalled();
            expect(mockUpdateLogoutFlow).toHaveBeenCalled();
            expect(response.redirect).toHaveBeenCalledWith("/signup-invite");
            expect(result).toBe(false);
        });
    });

    describe("affiliation mismatch", () => {
        it("should logout and redirect to /unauthorized when affiliation does not match", async () => {
            setupDefaultUserMock();
            const session = createMockSession({
                traits: { app_affiliation: "wrong-app" },
            });
            mockToSession.mockResolvedValue({ data: session });

            const { context, response } = createMockContext(
                "ory_session=abc",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(mockCreateBrowserLogoutFlow).toHaveBeenCalled();
            expect(response.redirect).toHaveBeenCalledWith("/unauthorized");
            expect(result).toBe(false);
        });
    });

    describe("Regular user with override_public_routes", () => {
        it("should redirect Regular user to /unauthorized when override_public_routes is set", async () => {
            setupDefaultUserMock();
            const session = createMockSession({
                traits: { role: { main: Roles.Regular } },
            });
            mockToSession.mockResolvedValue({ data: session });

            configService.get.mockImplementation((key: string) => {
                const config = {
                    authentication_type: "ory",
                    "ory.url": "http://localhost:4433",
                    "ory.access_token": "mock-access-token",
                    app_affiliation: "aletheia",
                    override_public_routes: "true",
                };
                return config[key];
            });

            const { context, response } = createMockContext(
                "ory_session=abc",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(response.redirect).toHaveBeenCalledWith("/unauthorized");
            expect(result).toBe(false);
        });
    });

    describe("non-ory authentication type", () => {
        it("should redirect to login when auth type is not ory", async () => {
            configService.get.mockImplementation((key: string) => {
                if (key === "authentication_type") return "none";
                return undefined;
            });

            const { context, response } = createMockContext(
                "no-cookie",
                false,
                "/dashboard"
            );

            const result = await guard.canActivate(context);

            expect(response.redirect).toHaveBeenCalledWith("/login");
            expect(result).toBe(false);
        });
    });
});
