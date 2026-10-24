import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration, OAuth2Api } from "@ory/client";
import OryService from "../auth/ory/ory.service";

export interface ConsentSummary {
    clientName: string;
    scopes: string[];
}

export type ConsentDecision = "accept" | "reject";

/**
 * Login and consent provider for Hydra (OAuth2 login/consent flow).
 *
 * Kratos 0.13 has no Hydra integration, so Hydra's login and consent URLs
 * point at Aletheia: login accepts the challenge for the identity already
 * signed in through Kratos, and consent is confirmed by the user on a page.
 * On Ory Network these screens are Ory-hosted and this provider is unused.
 */
@Injectable()
export class McpOAuthProviderService {
    constructor(
        private readonly configService: ConfigService,
        private readonly oryService: OryService
    ) {}

    private get hydra(): OAuth2Api {
        return new OAuth2Api(
            new Configuration({
                basePath: this.configService.get<string>("ory.hydra.url"),
                accessToken: this.configService.get<string>("ory.access_token"),
            })
        );
    }

    /** Kratos identity id for the session cookies, or null when signed out. */
    async getSessionSubject(cookies?: string): Promise<string | null> {
        if (!cookies) return null;
        try {
            const session = await this.oryService.whoAmI(cookies);
            return session?.identity?.id ?? null;
        } catch {
            return null;
        }
    }

    /**
     * Resolves a Hydra login challenge to the URL the browser continues to:
     * back to Hydra once the signed-in identity is accepted, or to the Aletheia
     * login page (returning here afterwards) when there is no session.
     */
    async resolveLogin(
        loginChallenge: string,
        cookies: string | undefined,
        selfUrl: string
    ): Promise<string> {
        const { data: request } = await this.hydra.getOAuth2LoginRequest({
            loginChallenge,
        });
        const subject = await this.getSessionSubject(cookies);
        if (!subject) {
            return `/login?return_to=${encodeURIComponent(selfUrl)}`;
        }
        const { data } = await this.hydra.acceptOAuth2LoginRequest({
            loginChallenge,
            acceptOAuth2LoginRequest: {
                subject,
                remember: !request.skip,
                remember_for: 2592000,
            },
        });
        return data.redirect_to;
    }

    async getConsent(
        consentChallenge: string,
        cookies: string | undefined
    ): Promise<ConsentSummary> {
        const request = await this.getOwnedConsentRequest(
            consentChallenge,
            cookies
        );
        return {
            clientName:
                request.client?.client_name ||
                request.client?.client_id ||
                "Unknown application",
            scopes: request.requested_scope ?? [],
        };
    }

    /** Applies the user's decision and returns the URL to continue to. */
    async decideConsent(
        consentChallenge: string,
        decision: ConsentDecision,
        cookies: string | undefined
    ): Promise<string> {
        const request = await this.getOwnedConsentRequest(
            consentChallenge,
            cookies
        );
        if (decision === "reject") {
            const { data } = await this.hydra.rejectOAuth2ConsentRequest({
                consentChallenge,
                rejectOAuth2Request: {
                    error: "access_denied",
                    error_description: "The user denied the request",
                },
            });
            return data.redirect_to;
        }
        const { data } = await this.hydra.acceptOAuth2ConsentRequest({
            consentChallenge,
            acceptOAuth2ConsentRequest: {
                grant_scope: request.requested_scope,
                grant_access_token_audience:
                    request.requested_access_token_audience,
                remember: true,
                remember_for: 2592000,
            },
        });
        return data.redirect_to;
    }

    /**
     * The consent request names the identity Hydra authenticated; only that
     * same signed-in user may view or answer it.
     */
    private async getOwnedConsentRequest(
        consentChallenge: string,
        cookies: string | undefined
    ) {
        const subject = await this.getSessionSubject(cookies);
        if (!subject) throw new UnauthorizedException("Not signed in");
        const { data: request } = await this.hydra.getOAuth2ConsentRequest({
            consentChallenge,
        });
        if (request.subject !== subject) {
            throw new ForbiddenException(
                "Consent request belongs to another user"
            );
        }
        return request;
    }
}
