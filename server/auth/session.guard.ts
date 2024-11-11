import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Configuration, FrontendApi } from "@ory/client";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Roles } from "./ability/ability.factory";
import { Logger } from "@nestjs/common";

@Injectable()
export class SessionGuard implements CanActivate {
    private readonly logger = new Logger(SessionGuard.name);

    constructor(
        private configService: ConfigService,
        private readonly reflector: Reflector
    ) {}

    // @ts-ignore
    async canActivate(
        context: ExecutionContext
    ): Promise<boolean | Promise<boolean>> {
        const isPublic = this.reflector.get<boolean>(
            "public",
            context.getHandler()
        );

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const type = this.configService.get<string>("authentication_type");

        try {
            if (type === "ory") {
                const oryConfig = new Configuration({
                    basePath: this.configService.get<string>("ory.url"),
                    accessToken: this.configService.get<string>("access_token"),
                });
                const ory = new FrontendApi(oryConfig);
                const { data: session } = await ory.toSession({
                    cookie: request.header("Cookie"),
                });

                const expectedAffiliation =
                    this.configService.get<string>("app_affiliation");
                const appAffiliation =
                    session?.identity?.traits?.app_affiliation;
                if (appAffiliation !== expectedAffiliation) {
                    this.logger.error(
                        `Affiliation mismatch: expected ${expectedAffiliation}, got ${appAffiliation}`
                    );
                    try {
                        const { data } = await ory.createBrowserLogoutFlow({
                            cookie: request.header("Cookie"),
                        });
                        await ory.updateLogoutFlow({
                            cookie: request.header("Cookie"),
                            token: data.logout_token,
                        });
                    } catch (e) {
                        this.logger.error("Error during logout flow", e);
                    }
                    return this.checkAndRedirect(
                        request,
                        response,
                        isPublic,
                        "/unauthorized"
                    );
                }
                request.user = {
                    _id: session?.identity?.traits?.user_id,
                    // Needed to enable feature flag for specific users
                    id: session?.identity?.traits?.user_id,
                    role: session?.identity?.traits?.role,
                    status: session?.identity.state,
                };
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
        } catch (e) {
            return this.checkAndRedirect(request, response, isPublic, "/login");
        }
    }

    private checkAndRedirect(request, response, isPublic, redirectPath) {
        const isAllowedPublicUrl = [
            "/login",
            "/unauthorized",
            "/_next",
            "/api/.ory",
            "/api/health",
            "/sign-up",
            "/api/user/register",
        ].some((route) => request.url.startsWith(route));

        const overridePublicRoutes =
            !isAllowedPublicUrl &&
            this.configService.get<string>("override_public_routes");

        if (
            (isPublic && !overridePublicRoutes) ||
            request.url.startsWith("/api")
        ) {
            return true;
        } else {
            response.redirect(redirectPath);
            return false;
        }
    }
}
