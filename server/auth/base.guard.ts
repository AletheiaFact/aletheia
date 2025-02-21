import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { Configuration } from "@ory/client";

@Injectable()
export abstract class BaseGuard implements CanActivate {
    protected logger = new Logger(BaseGuard.name);
    protected oryConfig = new Configuration({
        basePath: this.configService.get<string>("ory.url"),
        accessToken: this.configService.get<string>("ory.access_token"),
    });

    constructor(
        protected configService: ConfigService,
        protected readonly reflector: Reflector
    ) {}

    // Implement this in child guards
    abstract canActivate(context: ExecutionContext): Promise<boolean> | boolean;

    /**
     * Utility to extract a bearer token from Authorization header.
     */
    protected extractBearerToken(authHeader?: string): string | null {
        if (!authHeader) return null;
        const matches = authHeader.match(/Bearer\s+(\S+)/);
        return matches?.[1] || null;
    }

    /**
     * You can implement a shared redirect or fallback logic here.
     */
    protected checkAndRedirect(request, response, isPublic, redirectPath) {
        const isAllowedPublicUrl = [
            "/login",
            "/unauthorized",
            "/_next",
            "/api/.ory",
            "/api/health",
            "/sign-up",
            "/api/user/register",
            "/api/claim", // Allow this route to be public temporarily for testing
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
