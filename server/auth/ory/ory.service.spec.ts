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
