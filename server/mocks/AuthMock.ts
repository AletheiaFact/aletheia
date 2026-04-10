import { vi } from "vitest";
import { Roles } from "../auth/ability/ability.factory";

/**
 * Mock Ory session fixtures for each role type
 */
export const createMockSession = (overrides: any = {}) => ({
    id: "session-id-123",
    active: true,
    identity: {
        id: "ory-identity-id",
        state: "active",
        traits: {
            user_id: "mongo-user-id-123",
            email: "test@aletheia.org",
            role: { main: Roles.Regular },
            app_affiliation: "aletheia",
            ...overrides.traits,
        },
        ...overrides.identity,
    },
    ...overrides,
});

export const mockAdminSession = createMockSession({
    traits: { role: { main: Roles.Admin } },
});

export const mockSuperAdminSession = createMockSession({
    traits: { role: { main: Roles.SuperAdmin } },
});

export const mockFactCheckerSession = createMockSession({
    traits: { role: { main: Roles.FactChecker } },
});

export const mockReviewerSession = createMockSession({
    traits: { role: { main: Roles.Reviewer } },
});

export const mockRegularSession = createMockSession({
    traits: { role: { main: Roles.Regular } },
});

export const mockExpiredSession = new Error("Request failed with status code 401");

/**
 * Mock Ory FrontendApi
 */
export const mockOryFrontendApi = () => ({
    toSession: vi.fn<() => Promise<any>>(),
    createBrowserLogoutFlow: vi.fn<() => Promise<any>>().mockResolvedValue({
        data: { logout_token: "mock-logout-token" },
    }),
    updateLogoutFlow: vi.fn<() => Promise<any>>().mockResolvedValue({}),
});

/**
 * Mock Ory OAuth2Api (for M2M guard)
 */
export const mockOryOAuth2Api = () => ({
    introspectOAuth2Token: vi.fn<() => Promise<any>>(),
});

/**
 * Mock OryService (for UsersService tests)
 */
export const mockOryService = () => ({
    createIdentity: vi.fn<() => Promise<any>>().mockResolvedValue({
        id: "new-ory-id",
    }),
    updateIdentity: vi.fn<() => Promise<any>>().mockResolvedValue({}),
    updateUserState: vi.fn<() => Promise<any>>().mockResolvedValue({}),
    updateUserRole: vi.fn<() => Promise<any>>().mockResolvedValue({}),
});

/**
 * Mock UsersService (for SessionGuard tests)
 */
export const mockUsersService = () => ({
    getById: vi.fn<() => Promise<any>>().mockResolvedValue({
        _id: "mongo-user-id-123",
        name: "Test User",
        role: { main: Roles.Regular },
    }),
    getByOryId: vi.fn<() => Promise<any>>(),
    findAll: vi.fn<() => Promise<any>>(),
    register: vi.fn<() => Promise<any>>(),
    getByEmail: vi.fn<() => Promise<any>>(),
    updateUser: vi.fn<() => Promise<any>>(),
    registerPasswordChange: vi.fn<() => Promise<any>>(),
    getAllUsers: vi.fn<() => Promise<any>>(),
});

/**
 * Mock ConfigService for auth tests
 */
export const mockAuthConfigService = () => ({
    get: vi.fn<(key: string) => any>().mockImplementation((key: string) => {
        const config = {
            authentication_type: "ory",
            "ory.url": "http://localhost:4433",
            "ory.access_token": "mock-access-token",
            "ory.hydra.url": "http://localhost:4445",
            app_affiliation: "aletheia",
            override_public_routes: undefined,
        };
        return config[key];
    }),
});
