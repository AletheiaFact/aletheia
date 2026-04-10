import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SessionGuard } from "./session.guard";
import { UsersService } from "../users/users.service";
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
const {
    mockToSession,
    mockCreateBrowserLogoutFlow,
    mockUpdateLogoutFlow,
} = vi.hoisted(() => ({
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

describe("SessionGuard", () => {
    let guard: SessionGuard;
    let usersService: ReturnType<typeof mockUsersService>;
    let configService: ReturnType<typeof mockAuthConfigService>;

    const createMockContext = (
        cookie = "ory_session=abc",
        isPublic = false,
        url = "/api/test"
    ) => {
        const mockRedirect = vi.fn();
        const request: any = {
            header: vi.fn().mockReturnValue(cookie),
            url,
            params: {},
        };
        const response = { redirect: mockRedirect };
        const handler = vi.fn();
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

    describe("invalid session", () => {
        it("should redirect to login when session is expired", async () => {
            mockToSession.mockRejectedValue(new Error("401 Unauthorized"));

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
            mockToSession.mockRejectedValue(new Error("401 Unauthorized"));

            const { context } = createMockContext(
                "ory_session=expired",
                false,
                "/api/health"
            );

            const result = await guard.canActivate(context);
            expect(result).toBe(true);
        });
    });

    describe("user not found in DB", () => {
        it("should logout and redirect to signup-invite when user not in MongoDB", async () => {
            const session = createMockSession();
            mockToSession.mockResolvedValue({ data: session });
            usersService.getById.mockRejectedValue(
                new Error("User not found")
            );

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
