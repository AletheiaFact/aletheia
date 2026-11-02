import { BadGatewayException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MCP_REGISTER_PATH } from "./mcp.constants";

const UPSTREAM_TIMEOUT_MS = 5000;

/**
 * Hydra answers dynamic client registration with every unset field present
 * as `null` or `""` (e.g. `contacts: null`, `client_uri: ""`). Strict MCP
 * clients validate the response (RFC 7591) and reject it, so unset fields
 * are dropped.
 */
export function sanitizeClientRegistration(
    registration: Record<string, unknown>
): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(registration).filter(
            ([, value]) => value !== null && value !== undefined && value !== ""
        )
    );
}

/**
 * Fronts the upstream authorization server (Ory/Hydra) so MCP clients can
 * discover and register against a spec-compliant surface: it serves
 * RFC 8414 metadata that points `registration_endpoint` at our proxy and
 * relays registrations with the response sanitized.
 */
@Injectable()
export class McpOAuthProxyService {
    static readonly METADATA_CACHE_TTL_MS = 60_000;
    private metadataCache?: {
        metadata: Record<string, any>;
        expiresAt: number;
    };

    constructor(private readonly configService: ConfigService) {}

    private get publicUrl(): string {
        return this.configService.get<string>("mcp.public_url") ?? "";
    }

    /** Upstream authorization server (Ory/Hydra) base URL, no trailing slash. */
    get upstreamUrl(): string {
        const url =
            this.configService.get<string>("mcp.authorization_server") ||
            this.configService.get<string>("ory.url") ||
            "";
        return url.replace(/\/+$/, "");
    }

    async getAuthorizationServerMetadata(): Promise<Record<string, any>> {
        const upstream = await this.getUpstreamMetadata();
        return {
            ...upstream,
            issuer: this.publicUrl,
            registration_endpoint: `${this.publicUrl}/${MCP_REGISTER_PATH}`,
        };
    }

    async register(
        registration: Record<string, unknown>
    ): Promise<{ status: number; body: unknown }> {
        const upstream = await this.getUpstreamMetadata();
        const endpoint =
            upstream.registration_endpoint ||
            `${this.upstreamUrl}/oauth2/register`;
        const response = await this.fetchUpstream(endpoint, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(registration ?? {}),
        });
        const body = await response.json().catch(() => ({}));
        return {
            status: response.status,
            body:
                response.ok && body && typeof body === "object"
                    ? sanitizeClientRegistration(body)
                    : body,
        };
    }

    private async getUpstreamMetadata(): Promise<Record<string, any>> {
        if (this.metadataCache && this.metadataCache.expiresAt > Date.now()) {
            return this.metadataCache.metadata;
        }
        const response = await this.fetchUpstream(
            `${this.upstreamUrl}/.well-known/openid-configuration`
        );
        if (!response.ok) {
            throw new BadGatewayException(
                `Authorization server metadata unavailable (${response.status})`
            );
        }
        const metadata = await response.json();
        this.metadataCache = {
            metadata,
            expiresAt: Date.now() + McpOAuthProxyService.METADATA_CACHE_TTL_MS,
        };
        return metadata;
    }

    private async fetchUpstream(
        url: string,
        init: RequestInit = {}
    ): Promise<Response> {
        try {
            return await fetch(url, {
                ...init,
                signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
            });
        } catch {
            throw new BadGatewayException("Authorization server unreachable");
        }
    }
}
