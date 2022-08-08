import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Configuration, V0alpha2Api } from "@ory/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler()
        );
        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const ory = new V0alpha2Api(
                new Configuration({
                    basePath: this.configService.get<string>("ory.url"),
                    accessToken: this.configService.get<string>("access_token"),
                })
            );
            const { data: session } = await ory.toSession(
                undefined,
                request.header("Cookie")
            );
            const userRole = session?.identity?.traits?.role;

            return roles.includes(userRole);
        }

        return false;
    }
}
