import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    Scope,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration, FrontendApi } from "@ory/client";
import { NameSpaceService } from "./name-space.service";

@Injectable({ scope: Scope.REQUEST })
export class NameSpaceGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private nameSpaceService: NameSpaceService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const oryConfig = new Configuration({
            basePath: this.configService.get<string>("ory.url"),
            accessToken: this.configService.get<string>("ory.access_token"),
        });

        const namespaceSlug = request.params.namespace;
        const cookie = request.header("Cookie");

        if (!cookie && namespaceSlug) {
            throw new UnauthorizedException();
        }

        if (namespaceSlug && cookie) {
            const { data: session } = await new FrontendApi(
                oryConfig
            ).toSession({ cookie });

            const user_id = session.identity.traits.user_id;
            const namespace = await this.nameSpaceService.findOne({
                slug: namespaceSlug,
            });

            if (!namespace) {
                throw new NotFoundException();
            }

            const userHasAccess = namespace.users.some(
                //@ts-ignore
                (user) => user._id.toString() === user_id
            );
            if (!userHasAccess) {
                throw new UnauthorizedException();
            }

            return true;
        }

        return true;
    }
}
