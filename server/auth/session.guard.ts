import { ExecutionContext, Injectable } from "@nestjs/common";
import { Configuration, FrontendApi } from "@ory/client";
import { Roles } from "./ability/ability.factory";
import { Logger } from "@nestjs/common";
import { BaseGuard } from "./base.guard";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../../server/users/users.service";
import { ConfigService } from "@nestjs/config";
import { toError } from "../util/error-handling";

@Injectable()
export class SessionGuard extends BaseGuard {
    protected readonly logger = new Logger(SessionGuard.name);

    constructor(
        protected configService: ConfigService,
        protected reflector: Reflector,
        private readonly usersService: UsersService
    ) {
        super(configService, reflector);
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
            this.logger.error(`Error during logout flow: ${err.message}`, err.stack);
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
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

                const expectedAffiliation =
                    this.configService.get<string>("app_affiliation");
                const appAffiliation =
                    session?.identity?.traits?.app_affiliation;
                if (appAffiliation !== expectedAffiliation) {
                    this.logger.error(
                        `Affiliation mismatch: expected ${expectedAffiliation}, got ${appAffiliation}`
                    );
                    await this.logoutUser(ory, request);
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
                    status: session?.identity?.state,
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
        } catch (error) {
            const err = toError(error);

            this.logger.error(`Critical failure in AuthGuard: ${err.message}`, err.stack);

            return this.checkAndRedirect(request, response, isPublic, "/login");
        }
    }
}
