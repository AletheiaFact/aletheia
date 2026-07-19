import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration, OAuth2Api } from "@ory/client";
import OryService from "./ory/ory.service";
import { toError } from "../util/error-handling";

export interface AuthenticatedUser {
    isM2M: boolean;
    _id?: string;
    id?: string;
    role: Record<string, string>;
    status?: string;
    clientId?: string;
    subject?: string;
    scopes?: string[];
    namespace?: string;
}

/**
 * Centralizes Hydra token introspection, identity resolution, and
 * request.user shaping shared by M2MGuard, SessionGuard, and McpAuthGuard.
 */
@Injectable()
export class TokenIdentityService {
    private readonly logger = new Logger(TokenIdentityService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly oryService: OryService
    ) {}

    async introspect(token: string): Promise<Record<string, any> | null> {
        try {
            const hydraConfig = new Configuration({
                basePath: this.configService.get<string>("ory.hydra.url"),
                accessToken: this.configService.get<string>("ory.access_token"),
            });
            const hydraApi = new OAuth2Api(hydraConfig);
            const { data } = await hydraApi.introspectOAuth2Token({ token });
            return data;
        } catch (error) {
            const err = toError(error);
            this.logger.error(`Token introspection failed: ${err.message}`, err.stack);
            return null;
        }
    }

    isAffiliationValid(traits: any): boolean {
        const expected = this.configService.get<string>("app_affiliation");
        return Boolean(expected && traits && traits.app_affiliation === expected);
    }

    buildIdentityUser(traits: any, state?: string): AuthenticatedUser {
        return { isM2M: false, _id: traits.user_id, id: traits.user_id, role: traits.role, status: state };
    }

    shapeM2MUser(introspection: Record<string, any>): AuthenticatedUser {
        return {
            isM2M: true,
            clientId: introspection.client_id,
            subject: introspection.sub,
            scopes: introspection.scope?.split(" "),
            role: { main: "integration" },
            namespace: "main",
        };
    }

    async resolveBearerToken(token: string): Promise<AuthenticatedUser | null> {
        const introspection = await this.introspect(token);
        if (!introspection?.active) return null;

        const isM2M = introspection.client_id && introspection.sub === introspection.client_id;
        if (isM2M) return this.shapeM2MUser(introspection);

        let identity;
        try {
            identity = await this.oryService.getIdentity(introspection.sub);
        } catch (error) {
            const err = toError(error);
            this.logger.error(`Identity lookup failed: ${err.message}`, err.stack);
            return null;
        }
        const traits = identity?.traits;
        if (!this.isAffiliationValid(traits)) {
            this.logger.warn("Bearer identity failed affiliation check");
            return null;
        }
        if (identity.state !== "active") {
            this.logger.warn("Bearer identity is not active");
            return null;
        }
        return this.buildIdentityUser(traits, identity.state);
    }
}
