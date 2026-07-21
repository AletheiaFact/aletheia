import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { TokenIdentityService } from "./token-identity.service";
import OryService from "./ory/ory.service";

const mockIntrospect = vi.hoisted(() => vi.fn());
vi.mock("@ory/client", () => ({
    Configuration: vi.fn().mockImplementation(function () {
        return {};
    }),
    OAuth2Api: vi.fn().mockImplementation(function () {
        return { introspectOAuth2Token: mockIntrospect };
    }),
}));

const config: Record<string, any> = {
    "ory.hydra.url": "http://hydra",
    "ory.access_token": "admin-token",
    app_affiliation: "aletheia",
};
const mockGetIdentity = vi.fn();

describe("TokenIdentityService", () => {
    let service: TokenIdentityService;
    beforeEach(async () => {
        vi.clearAllMocks();
        const mod: TestingModule = await Test.createTestingModule({
            providers: [
                TokenIdentityService,
                {
                    provide: ConfigService,
                    useValue: { get: vi.fn((k: string) => config[k]) },
                },
                {
                    provide: OryService,
                    useValue: { getIdentity: mockGetIdentity },
                },
            ],
        }).compile();
        service = mod.get(TokenIdentityService);
    });

    it("resolves a machine token (sub===client_id) to the integration shape without an identity lookup", async () => {
        mockIntrospect.mockResolvedValue({
            data: {
                active: true,
                client_id: "c1",
                sub: "c1",
                scope: "read write",
            },
        });
        const user = await service.resolveBearerToken("m2m");
        expect(user).toEqual({
            isM2M: true,
            clientId: "c1",
            subject: "c1",
            scopes: ["read", "write"],
            role: { main: "integration" },
            namespace: "main",
        });
        expect(mockGetIdentity).not.toHaveBeenCalled();
    });

    it("resolves a user token to the real Kratos identity/role", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-9" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "id-9",
            state: "active",
            traits: {
                user_id: "u9",
                role: { main: "admin" },
                app_affiliation: "aletheia",
            },
        });
        const user = await service.resolveBearerToken("user-tok");
        expect(mockGetIdentity).toHaveBeenCalledWith("id-9");
        expect(user).toEqual({
            isM2M: false,
            _id: "u9",
            id: "u9",
            role: { main: "admin" },
            status: "active",
        });
    });

    it("returns null for an inactive token", async () => {
        mockIntrospect.mockResolvedValue({ data: { active: false } });
        expect(await service.resolveBearerToken("x")).toBeNull();
    });

    it("returns null when introspection throws", async () => {
        mockIntrospect.mockRejectedValue(new Error("hydra down"));
        expect(await service.resolveBearerToken("x")).toBeNull();
    });

    it("returns null when getIdentity throws", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-2" },
        });
        mockGetIdentity.mockRejectedValue(new Error("404"));
        expect(await service.resolveBearerToken("x")).toBeNull();
    });

    it("returns null (does not throw) when the identity has no traits and app_affiliation is unset", async () => {
        // Regression: this used to throw in buildIdentityUser (traits.user_id).
        (service as any).configService.get = vi.fn((k: string) =>
            k === "app_affiliation" ? undefined : config[k]
        );
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-7" },
        });
        mockGetIdentity.mockResolvedValue({ id: "id-7", state: "active" });
        await expect(service.resolveBearerToken("x")).resolves.toBeNull();
    });

    it("returns null (does not throw) when getIdentity resolves a null identity", async () => {
        (service as any).configService.get = vi.fn((k: string) =>
            k === "app_affiliation" ? undefined : config[k]
        );
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-8" },
        });
        mockGetIdentity.mockResolvedValue(null);
        await expect(service.resolveBearerToken("x")).resolves.toBeNull();
    });

    it("returns null when the identity has no traits and app_affiliation is configured", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-6" },
        });
        mockGetIdentity.mockResolvedValue({ id: "id-6", state: "active" });
        await expect(service.resolveBearerToken("x")).resolves.toBeNull();
    });

    it("returns null on affiliation mismatch", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-3" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "id-3",
            state: "active",
            traits: {
                user_id: "u3",
                role: { main: "admin" },
                app_affiliation: "other",
            },
        });
        expect(await service.resolveBearerToken("x")).toBeNull();
    });

    it("does not enforce affiliation when app_affiliation config is unset (matches the platform's fail-open default)", async () => {
        (service as any).configService.get = vi.fn((k: string) =>
            k === "app_affiliation" ? undefined : config[k]
        );
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-4" },
        });
        // Deployment without app_affiliation configured; identity has no affiliation trait (e.g. the CI/cypress env).
        mockGetIdentity.mockResolvedValue({
            id: "id-4",
            state: "active",
            traits: { user_id: "u4", role: { main: "admin" } },
        });
        expect(await service.resolveBearerToken("x")).toEqual({
            isM2M: false,
            _id: "u4",
            id: "u4",
            role: { main: "admin" },
            status: "active",
        });
    });

    it("returns null when the identity is not active", async () => {
        mockIntrospect.mockResolvedValue({
            data: { active: true, client_id: "mcp", sub: "id-5" },
        });
        mockGetIdentity.mockResolvedValue({
            id: "id-5",
            state: "inactive",
            traits: {
                user_id: "u5",
                role: { main: "admin" },
                app_affiliation: "aletheia",
            },
        });
        expect(await service.resolveBearerToken("x")).toBeNull();
    });

    it("isAffiliationValid: enforces the configured value, and is not enforced when unset", () => {
        // config app_affiliation === "aletheia"
        expect(
            service.isAffiliationValid({ app_affiliation: "aletheia" })
        ).toBe(true);
        expect(service.isAffiliationValid({ app_affiliation: "other" })).toBe(
            false
        );
        expect(service.isAffiliationValid({})).toBe(false);
        expect(service.isAffiliationValid(undefined)).toBe(false);
        // when app_affiliation is not configured, affiliation is not enforced
        (service as any).configService.get = vi.fn(() => undefined);
        expect(service.isAffiliationValid({})).toBe(true);
        expect(service.isAffiliationValid(undefined)).toBe(true);
    });

    it("buildIdentityUser shapes the session/user object", () => {
        expect(
            service.buildIdentityUser(
                { user_id: "u1", role: { main: "reviewer" } },
                "active"
            )
        ).toEqual({
            isM2M: false,
            _id: "u1",
            id: "u1",
            role: { main: "reviewer" },
            status: "active",
        });
    });
});
