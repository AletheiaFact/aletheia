import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import OryService from "./ory.service";

describe("OryService.getIdentity", () => {
    const fetchMock = vi.fn();
    let oryService: OryService;

    beforeEach(async () => {
        vi.stubGlobal("fetch", fetchMock);
        fetchMock.mockReset();
        const module = await Test.createTestingModule({
            providers: [
                OryService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: vi.fn((key: string) =>
                            key === "ory"
                                ? {
                                      url: "http://ory",
                                      admin_url: "http://ory-admin",
                                      admin_endpoint: "admin",
                                      access_token: "test-token",
                                  }
                                : "aletheia"
                        ),
                    },
                },
            ],
        }).compile();
        oryService = await module.resolve(OryService);
    });

    afterEach(() => vi.unstubAllGlobals());

    it("fetches an identity by id from the Kratos admin API", async () => {
        const identity = {
            id: "identity-1",
            state: "active",
            traits: { user_id: "u1", role: { main: "admin" } },
        };
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => identity,
        });

        const result = await oryService.getIdentity("identity-1");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://ory-admin/admin/identities/identity-1",
            expect.objectContaining({
                method: "get",
                headers: expect.objectContaining({
                    Authorization: "Bearer test-token",
                }),
            })
        );
        expect(result).toEqual(identity);
    });

    it("throws when the admin API responds non-2xx", async () => {
        fetchMock.mockResolvedValue({ ok: false, status: 404 });
        await expect(oryService.getIdentity("missing")).rejects.toThrow(
            /Failed to fetch identity/
        );
    });
});

describe("OryService identity updates", () => {
    const fetchMock = vi.fn();
    let oryService: OryService;
    const user = {
        _id: { toString: () => "6ab65de7154e6b5fe6d70827" },
        oryId: "ory-1",
        email: "user@example.com",
        role: { main: "fact-checker" },
    };

    const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body);

    beforeEach(async () => {
        vi.stubGlobal("fetch", fetchMock);
        fetchMock.mockReset();
        fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
        const module = await Test.createTestingModule({
            providers: [
                OryService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: vi.fn((key: string) =>
                            key === "ory"
                                ? {
                                      url: "http://ory",
                                      admin_url: "http://ory-admin",
                                      admin_endpoint: "admin",
                                      access_token: "test-token",
                                      schema_id: "default",
                                  }
                                : "aletheia"
                        ),
                    },
                },
            ],
        }).compile();
        oryService = await module.resolve(OryService);
    });

    afterEach(() => vi.unstubAllGlobals());

    const fullTraits = {
        email: "user@example.com",
        user_id: "6ab65de7154e6b5fe6d70827",
        app_affiliation: "aletheia",
        role: { main: "fact-checker" },
    };

    it("updateUserState keeps role and app_affiliation in the traits", async () => {
        await oryService.updateUserState(user, "inactive");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://ory-admin/admin/identities/ory-1",
            expect.objectContaining({ method: "put" })
        );
        expect(sentBody()).toEqual({
            schema_id: "default",
            state: "inactive",
            traits: fullTraits,
        });
    });

    it("updateUserState applies a new role in the same request", async () => {
        await oryService.updateUserState(user, "active", { main: "admin" });

        expect(sentBody().traits.role).toEqual({ main: "admin" });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("updateUserRole sends the full traits with the new role", async () => {
        await oryService.updateUserRole(user, { main: "reviewer" });

        expect(sentBody().traits).toEqual({
            ...fullTraits,
            role: { main: "reviewer" },
        });
    });

    it("updateIdentity falls back to the user's stored role", async () => {
        await oryService.updateIdentity(user, null as any, {
            role: undefined,
        });

        expect(sentBody().traits).toEqual(fullTraits);
        expect(sentBody().credentials).toEqual({});
    });

    it("updateIdentity defaults to the regular role when none is known", async () => {
        await oryService.updateIdentity(
            { ...user, role: undefined },
            null as any
        );

        expect(sentBody().traits.role).toEqual({ main: "regular" });
    });

    it("throws when Kratos rejects the update", async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 400,
            text: async () => "schema violation",
        });

        await expect(
            oryService.updateUserRole(user, { main: "admin" })
        ).rejects.toThrow(
            /Failed to update identity ory-1: 400 schema violation/
        );
    });
});
