import {
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Configuration, OAuth2Api } from "@ory/client";
import { BaseGuard } from "../auth/base.guard";
import OryService from "../auth/ory/ory.service";
import { toError } from "../util/error-handling";

interface CachedAuth {
    user: Record<string, any>;
    expiresAt: number;
}

/**
 * Bearer-token guard for the MCP endpoint.
 *
 * Unlike M2MGuard (which labels every active token as the `integration`
 * role), this guard distinguishes machine tokens (sub === client_id) from
 * user tokens obtained via the OAuth authorization-code flow, resolving the
 * latter to the real Kratos identity so CASL abilities apply the user's
 * actual role.
 */
@Injectable()
export class McpAuthGuard extends BaseGuard {
    protected readonly logger = new Logger(McpAuthGuard.name);
    private readonly cache = new Map<string, CachedAuth>();
    static readonly CACHE_TTL_MS = 60_000;

    constructor(
        protected configService: ConfigService,
        protected reflector: Reflector,
        private readonly oryService: OryService
    ) {
        super(configService, reflector);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();

        const token = this.extractBearerToken(
            request.headers["authorization"]
        );
        if (!token) {
            this.deny(response, "Missing bearer token");
        }

        const cached = this.cache.get(token);
        if (cached && cached.expiresAt > Date.now()) {
            request.user = cached.user;
            return true;
        }

        let introspection;
        try {
            const hydraConfig = new Configuration({
                basePath: this.configService.get<string>("ory.hydra.url"),
                accessToken:
                    this.configService.get<string>("ory.access_token"),
            });
            const hydraApi = new OAuth2Api(hydraConfig);
            ({ data: introspection } = await hydraApi.introspectOAuth2Token({
                token,
            }));
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `MCP token introspection failed: ${err.message}`,
                err.stack
            );
            this.deny(response, "Token introspection failed");
        }

        if (!introspection.active) {
            this.deny(response, "Inactive token");
        }

        const user = await this.resolveUser(introspection, response);
        this.cache.set(token, {
            user,
            expiresAt: Date.now() + McpAuthGuard.CACHE_TTL_MS,
        });
        request.user = user;
        return true;
    }

    private async resolveUser(
        introspection: Record<string, any>,
        response: any
    ): Promise<Record<string, any>> {
        const isM2M =
            introspection.client_id &&
            introspection.sub === introspection.client_id;
        if (isM2M) {
            return {
                isM2M: true,
                clientId: introspection.client_id,
                subject: introspection.sub,
                scopes: introspection.scope?.split(" "),
                role: { main: "integration" },
                namespace: "main",
            };
        }

        let identity;
        try {
            identity = await this.oryService.getIdentity(introspection.sub);
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `MCP identity lookup failed: ${err.message}`,
                err.stack
            );
            this.deny(response, "Identity lookup failed");
        }

        const traits = identity?.traits;
        const expectedAffiliation =
            this.configService.get<string>("app_affiliation");
        if (!traits || traits.app_affiliation !== expectedAffiliation) {
            this.deny(response, "Affiliation mismatch");
        }

        return {
            isM2M: false,
            _id: traits.user_id,
            id: traits.user_id,
            role: traits.role,
            status: identity.state,
        };
    }

    private deny(response: any, reason: string): never {
        const publicUrl = this.configService.get<string>("mcp.public_url");
        response.setHeader(
            "WWW-Authenticate",
            `Bearer resource_metadata="${publicUrl}/.well-known/oauth-protected-resource/server/mcp"`
        );
        throw new UnauthorizedException(reason);
    }
}
