import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configuration, FrontendApi } from "@ory/client";
import { NameSpaceService } from "./name-space.service";

@Injectable()
export class NameSpaceGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private nameSpaceService: NameSpaceService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const oryConfig = new Configuration({
            basePath: this.configService.get<string>("ory.url"),
            accessToken: this.configService.get<string>("access_token"),
        });

        const namespaceName = request.params.namespace;
        const cookie = request.header("Cookie");

        if (!cookie && namespaceName) {
            throw new UnauthorizedException();
        }

        if (namespaceName && cookie) {
            const { data: session } = await new FrontendApi(
                oryConfig
            ).toSession({ cookie });

            const user_id = session.identity.traits.user_id;
            const namespace = await this.nameSpaceService.findOne({
                name: namespaceName,
            });

            if (!namespace) {
                throw new NotFoundException(
                    "User does not have access to this namespace"
                );
            }

            //@ts-ignore
            const userHasAccess = namespace.users.some(
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
