// TODO(vitest-phase2): Drop this `@jest/globals` import after Jest is removed.
// Under Vitest, this import is redirected to a stub via resolve.alias in
// vitest.config.ts. Under Jest, it provides typed access to `jest.fn<...>()`.
import { jest } from "@jest/globals";
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
    toSession: jest.fn<() => Promise<any>>(),
    createBrowserLogoutFlow: jest.fn<() => Promise<any>>().mockResolvedValue({
        data: { logout_token: "mock-logout-token" },
    }),
    updateLogoutFlow: jest.fn<() => Promise<any>>().mockResolvedValue({}),
});

/**
 * Mock Ory OAuth2Api (for M2M guard)
 */
export const mockOryOAuth2Api = () => ({
    introspectOAuth2Token: jest.fn<() => Promise<any>>(),
});

/**
 * Mock OryService (for UsersService tests)
 */
export const mockOryService = () => ({
    createIdentity: jest.fn<() => Promise<any>>().mockResolvedValue({
        id: "new-ory-id",
    }),
    updateIdentity: jest.fn<() => Promise<any>>().mockResolvedValue({}),
    updateUserState: jest.fn<() => Promise<any>>().mockResolvedValue({}),
    updateUserRole: jest.fn<() => Promise<any>>().mockResolvedValue({}),
});

/**
 * Mock UsersService (for SessionGuard tests)
 */
export const mockUsersService = () => ({
    getById: jest.fn<() => Promise<any>>().mockResolvedValue({
        _id: "mongo-user-id-123",
        name: "Test User",
        role: { main: Roles.Regular },
    }),
    getByOryId: jest.fn<() => Promise<any>>(),
    findAll: jest.fn<() => Promise<any>>(),
    register: jest.fn<() => Promise<any>>(),
    getByEmail: jest.fn<() => Promise<any>>(),
    updateUser: jest.fn<() => Promise<any>>(),
    registerPasswordChange: jest.fn<() => Promise<any>>(),
    getAllUsers: jest.fn<() => Promise<any>>(),
});

/**
 * Mock ConfigService for auth tests
 */
export const mockAuthConfigService = () => ({
    get: jest.fn<(key: string) => any>().mockImplementation((key: string) => {
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
