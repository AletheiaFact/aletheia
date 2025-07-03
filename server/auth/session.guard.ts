import { ExecutionContext, Injectable } from "@nestjs/common";
import { Configuration, FrontendApi } from "@ory/client";
import { Roles } from "./ability/ability.factory";
import { Logger } from "@nestjs/common";
import { BaseGuard } from "./base.guard";
import { Reflector } from "@nestjs/core";
import { UsersService } from "users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SessionGuard extends BaseGuard {
    private readonly logger = new Logger(SessionGuard.name);

    constructor(
        private readonly configService: ConfigService,
        reflector: Reflector,
        private readonly UsersService: UsersService
    ) {
        super(configService, reflector);
    }

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
                    accessToken:
                        this.configService.get<string>("ory.access_token"),
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
                    isM2M: false,
                    _id: session?.identity?.traits?.user_id,
                    // Needed to enable feature flag for specific users
                    id: session?.identity?.traits?.user_id,
                    role: session?.identity?.traits?.role,
                    status: session?.identity.state,
                };

                const mongoUserId = session?.identity?.traits?.user_id;
                const user = await this.UsersService.getById(mongoUserId);

                if (!user) {
                    this.logger.error(`User not found for ID: ${mongoUserId}`);
                    try {
                        const { data } = await ory.createBrowserLogoutFlow({
                            cookie: request.header("Cookie"),
                        });
                        await ory.updateLogoutFlow({
                            cookie: request.header("Cookie"),
                            token: data.logout_token,
                        });
                    } catch (error) {
                        this.logger.error(
                            "Error during logout flow for missing DB user",
                            error
                        );
                    }
                    return this.checkAndRedirect(
                        request,
                        response,
                        isPublic,
                        "/unauthorized"
                    );
                }

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
}
