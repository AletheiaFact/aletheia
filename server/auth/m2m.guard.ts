import { Injectable, ExecutionContext, Logger } from "@nestjs/common";
import { BaseGuard } from "./base.guard";
import { Configuration, OAuth2Api } from "@ory/client";

@Injectable()
export class M2MGuard extends BaseGuard {
    protected readonly logger = new Logger(M2MGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        try {
            const token = this.extractBearerToken(
                request.headers["authorization"]
            );
            if (!token) {
                return false;
            }

            const hydraBasePath =
                this.configService.get<string>("ory.hydra.url");
            const introspectionToken =
                this.configService.get<string>("ory.access_token");

            const hydraConfig = new Configuration({
                basePath: hydraBasePath,
                accessToken: introspectionToken,
            });
            const hydraApi = new OAuth2Api(hydraConfig);

            const { data } = await hydraApi.introspectOAuth2Token({ token });
            if (!data.active) {
                return false;
            }

            const isM2M = data.client_id && data.sub === data.client_id;
            request.user = {
                isM2M,
                clientId: data.client_id,
                subject: data.sub,
                scopes: data.scope?.split(" "),
                role: { main: "integration" },
                namespace: "main",
            };

            return true;
        } catch (error) {
            this.logger.error("M2M token validation failed", error);
            return false;
        }
    }
}
