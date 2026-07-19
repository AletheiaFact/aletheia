import {
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { createHash } from "crypto";
import { BaseGuard } from "../auth/base.guard";
import { TokenIdentityService } from "../auth/token-identity.service";
import { MCP_RESOURCE_METADATA_PATH } from "./mcp.constants";

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
        private readonly tokenIdentity: TokenIdentityService
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

        // Never keep raw bearer tokens in memory as cache keys.
        const cacheKey = createHash("sha256").update(token).digest("hex");
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
            request.user = cached.user;
            return true;
        }

        const user = await this.tokenIdentity.resolveBearerToken(token);
        if (!user) {
            this.deny(response, "Invalid or unauthorized token");
        }

        this.evictExpiredEntries();
        this.cache.set(cacheKey, {
            user,
            expiresAt: Date.now() + McpAuthGuard.CACHE_TTL_MS,
        });
        request.user = user;
        return true;
    }

    /**
     * Lazy sweep run on each cache write so entries for tokens never seen
     * again don't accumulate indefinitely.
     */
    private evictExpiredEntries(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache) {
            if (entry.expiresAt <= now) {
                this.cache.delete(key);
            }
        }
    }

    private deny(response: any, reason: string): never {
        const publicUrl = this.configService.get<string>("mcp.public_url");
        response.setHeader(
            "WWW-Authenticate",
            `Bearer resource_metadata="${publicUrl}/${MCP_RESOURCE_METADATA_PATH}"`
        );
        throw new UnauthorizedException(reason);
    }
}
