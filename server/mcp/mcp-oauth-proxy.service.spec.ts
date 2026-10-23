import { BadGatewayException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    McpOAuthProxyService,
    sanitizeClientRegistration,
} from "./mcp-oauth-proxy.service";

const configValues: Record<string, any> = {
    "mcp.public_url": "https://aletheiafact.org",
    "ory.url": "http://hydra:4444/",
};

const upstreamMetadata = {
    issuer: "http://hydra:4444",
    authorization_endpoint: "http://hydra:4444/oauth2/auth",
    token_endpoint: "http://hydra:4444/oauth2/token",
    registration_endpoint: "http://hydra:4444/oauth2/register",
};

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    });
}

describe("sanitizeClientRegistration", () => {
    it("drops null, undefined and empty-string fields", () => {
        expect(
            sanitizeClientRegistration({
                client_id: "abc",
                client_uri: "",
                contacts: null,
                owner: undefined,
                redirect_uris: ["http://127.0.0.1/cb"],
                audience: [],
            })
        ).toEqual({
            client_id: "abc",
            redirect_uris: ["http://127.0.0.1/cb"],
            audience: [],
        });
    });
});

describe("McpOAuthProxyService", () => {
    let service: McpOAuthProxyService;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        service = new McpOAuthProxyService({
            get: (key: string) => configValues[key],
        } as unknown as ConfigService);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("getAuthorizationServerMetadata", () => {
        it("overrides issuer and registration_endpoint, keeps the rest", async () => {
            fetchMock.mockResolvedValue(jsonResponse(upstreamMetadata));

            const metadata = await service.getAuthorizationServerMetadata();

            expect(fetchMock.mock.calls[0][0]).toBe(
                "http://hydra:4444/.well-known/openid-configuration"
            );
            expect(metadata).toEqual({
                ...upstreamMetadata,
                issuer: "https://aletheiafact.org",
                registration_endpoint:
                    "https://aletheiafact.org/api/mcp/register",
            });
        });

        it("caches upstream metadata between calls", async () => {
            fetchMock.mockResolvedValue(jsonResponse(upstreamMetadata));

            await service.getAuthorizationServerMetadata();
            await service.getAuthorizationServerMetadata();

            expect(fetchMock).toHaveBeenCalledTimes(1);
        });

        it("throws BadGateway when upstream is unreachable", async () => {
            fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

            await expect(
                service.getAuthorizationServerMetadata()
            ).rejects.toBeInstanceOf(BadGatewayException);
        });

        it("throws BadGateway when upstream answers with an error", async () => {
            fetchMock.mockResolvedValue(jsonResponse({}, 500));

            await expect(
                service.getAuthorizationServerMetadata()
            ).rejects.toBeInstanceOf(BadGatewayException);
        });
    });

    describe("register", () => {
        it("relays the registration and sanitizes the response", async () => {
            fetchMock
                .mockResolvedValueOnce(jsonResponse(upstreamMetadata))
                .mockResolvedValueOnce(
                    jsonResponse(
                        {
                            client_id: "abc",
                            client_uri: "",
                            contacts: null,
                            redirect_uris: ["http://127.0.0.1/cb"],
                        },
                        201
                    )
                );

            const result = await service.register({
                client_name: "claude",
                redirect_uris: ["http://127.0.0.1/cb"],
            });

            const [url, init] = fetchMock.mock.calls[1];
            expect(url).toBe("http://hydra:4444/oauth2/register");
            expect(init.method).toBe("POST");
            expect(JSON.parse(init.body)).toEqual({
                client_name: "claude",
                redirect_uris: ["http://127.0.0.1/cb"],
            });
            expect(result).toEqual({
                status: 201,
                body: {
                    client_id: "abc",
                    redirect_uris: ["http://127.0.0.1/cb"],
                },
            });
        });

        it("falls back to /oauth2/register when upstream omits the endpoint", async () => {
            const { registration_endpoint, ...withoutRegistration } =
                upstreamMetadata;
            fetchMock
                .mockResolvedValueOnce(jsonResponse(withoutRegistration))
                .mockResolvedValueOnce(jsonResponse({ client_id: "abc" }, 201));

            await service.register({});

            expect(fetchMock.mock.calls[1][0]).toBe(
                "http://hydra:4444/oauth2/register"
            );
        });

        it("passes upstream errors through unchanged", async () => {
            const error = { error: "invalid_redirect_uri", error_description: "" };
            fetchMock
                .mockResolvedValueOnce(jsonResponse(upstreamMetadata))
                .mockResolvedValueOnce(jsonResponse(error, 400));

            const result = await service.register({});

            expect(result).toEqual({ status: 400, body: error });
        });
    });
});
