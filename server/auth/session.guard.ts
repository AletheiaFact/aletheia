import {
    ExecutionContext,
    Injectable,
    Logger,
    ServiceUnavailableException,
} from "@nestjs/common";
import { Configuration, FrontendApi } from "@ory/client";
import { Roles } from "./ability/ability.factory";
import { BaseGuard } from "./base.guard";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../../server/users/users.service";
import { ConfigService } from "@nestjs/config";
import { toError } from "../util/error-handling";
import { TokenIdentityService } from "./token-identity.service";

/**
 * Hard deadline for the Ory session lookup. It is an abort signal, not the
 * axios `timeout`, because the axios timeout starts only after the socket
 * connects and so does not cover DNS resolution or the TCP handshake.
 */
export const ORY_REQUEST_TIMEOUT_MS = 5000;

/**
 * Kubernetes liveness/readiness probe path. It skips the Ory session lookup:
 * a slow or failing lookup here (e.g. a DNS outage) fails the probe and takes
 * the pod out of the load balancer, although the app itself is healthy.
 */
const HEALTH_CHECK_PATH = "/api/health";

type SessionLookupFailure = "unauthenticated" | "unreachable" | "unexpected";

/**
 * Sorts a toSession() rejection. Ory answers 401 (no or invalid session) and
 * 403 (AAL2 required) as normal outcomes. An axios error with no response
 * (DNS, connection refused, timeout/abort) or a 5xx means Ory is unavailable.
 */
const classifySessionLookupFailure = (error: unknown): SessionLookupFailure => {
    const axiosError = error as {
        isAxiosError?: boolean;
        response?: { status?: number };
    };
    if (!axiosError?.isAxiosError) {
        return "unexpected";
    }
    const status = axiosError.response?.status;
    if (status === undefined || status >= 500) {
        return "unreachable";
    }
    return "unauthenticated";
};

@Injectable()
export class SessionGuard extends BaseGuard {
    protected readonly logger = new Logger(SessionGuard.name);

    // SessionGuard is request-scoped (UsersService is), so the Ory client is
    // cached on the class to share it across requests.
    private static oryClient?: { key: string; api: FrontendApi };

    constructor(
        protected configService: ConfigService,
        protected reflector: Reflector,
        private readonly usersService: UsersService,
        private readonly tokenIdentity: TokenIdentityService
    ) {
        super(configService, reflector);
    }

    private getOryClient(): FrontendApi {
        const basePath = this.configService.get<string>("ory.url");
        const accessToken = this.configService.get<string>("ory.access_token");
        const key = `${basePath}|${accessToken}`;

        if (SessionGuard.oryClient?.key !== key) {
            SessionGuard.oryClient = {
                key,
                api: new FrontendApi(
                    new Configuration({ basePath, accessToken })
                ),
            };
        }
        return SessionGuard.oryClient.api;
    }

    private async logoutUser(ory: FrontendApi, request: any): Promise<void> {
        try {
            const { data } = await ory.createBrowserLogoutFlow({
                cookie: request.header("Cookie"),
            });
            await ory.updateLogoutFlow({
                cookie: request.header("Cookie"),
                token: data.logout_token,
            });
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Error during logout flow: ${err.message}`,
                err.stack
            );
        }
    }

    private handleSessionLookupFailure(
        error: unknown,
        request: any,
        response: any,
        isPublic: boolean
    ): boolean {
        const err = toError(error);

        switch (classifySessionLookupFailure(error)) {
            case "unauthenticated":
                this.logger.debug(
                    `No valid Ory session (${err.status ?? err.message})`
                );
                break;
            case "unreachable": {
                const status = (error as { response?: { status?: number } })
                    .response?.status;
                this.logger.error(
                    `Ory unreachable during session check (${
                        err.code ?? status ?? "unknown"
                    }): ${err.message}`
                );
                // An API caller with a valid session would otherwise be
                // treated as anonymous; fail with 503 so clients see an
                // outage, not a logout.
                if (
                    request.url.startsWith("/api") &&
                    !isPublic &&
                    !this.isAllowedPublicUrl(request.url)
                ) {
                    throw new ServiceUnavailableException(
                        "Authentication service unavailable"
                    );
                }
                break;
            }
            case "unexpected":
                this.logger.error(
                    `Critical failure in AuthGuard: ${err.message}`,
                    err.stack
                );
                break;
        }

        return this.checkAndRedirect(request, response, isPublic, "/login");
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(
            "public",
            context.getHandler()
        );

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();

        if (request.url.split("?")[0] === HEALTH_CHECK_PATH) {
            return true;
        }

        const type = this.configService.get<string>("authentication_type");

        try {
            if (type === "ory") {
                const ory = this.getOryClient();
                // Accept both browser cookie sessions (ory_session_…) and
                // native/API-flow session tokens (ory_st_…) sent via the
                // X-Session-Token header. The website keeps using the cookie;
                // native mobile apps that log in through Ory's API flow send
                // the token so they can call authenticated endpoints such as
                // DELETE /api/me for in-app account deletion.
                let session: Awaited<
                    ReturnType<FrontendApi["toSession"]>
                >["data"];
                try {
                    ({ data: session } = await ory.toSession(
                        {
                            cookie: request.header("Cookie"),
                            xSessionToken: request.header("X-Session-Token"),
                        },
                        { signal: AbortSignal.timeout(ORY_REQUEST_TIMEOUT_MS) }
                    ));
                } catch (error) {
                    return this.handleSessionLookupFailure(
                        error,
                        request,
                        response,
                        isPublic
                    );
                }

                const mongoUserId = session?.identity?.traits?.user_id;
                try {
                    await this.usersService.getById(mongoUserId);
                } catch (error) {
                    const err = toError(error);

                    this.logger.error(`User not found for ID: ${mongoUserId}`);
                    this.logger.error(err.message, err.stack);

                    await this.logoutUser(ory, request);
                    return this.checkAndRedirect(
                        request,
                        response,
                        isPublic,
                        "/signup-invite"
                    );
                }

                if (
                    !this.tokenIdentity.isAffiliationValid(
                        session?.identity?.traits
                    )
                ) {
                    this.logger.error(
                        `Affiliation mismatch: expected ${this.configService.get<string>(
                            "app_affiliation"
                        )}, got ${session?.identity?.traits?.app_affiliation}`
                    );
                    await this.logoutUser(ory, request);
                    return this.checkAndRedirect(
                        request,
                        response,
                        isPublic,
                        "/unauthorized"
                    );
                }

                request.user = this.tokenIdentity.buildIdentityUser(
                    session?.identity?.traits,
                    session?.identity?.state
                );

                const overridePublicRoutes =
                    session?.identity?.traits?.role.main === Roles.Regular &&
                    this.configService.get<string>("override_public_routes");

                if (overridePublicRoutes) {
                    return this.checkAndRedirect(
                        request,
                        response,
                        isPublic,
                        "/unauthorized"
                    );
                } else {
                    return true;
                }
            }

            return this.checkAndRedirect(request, response, isPublic, "/login");
        } catch (error) {
            if (error instanceof ServiceUnavailableException) {
                throw error;
            }
            const err = toError(error);

            this.logger.error(
                `Critical failure in AuthGuard: ${err.message}`,
                err.stack
            );

            return this.checkAndRedirect(request, response, isPublic, "/login");
        }
    }
}
