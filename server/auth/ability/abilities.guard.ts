import { ForbiddenError } from "@casl/ability";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Configuration, FrontendApi } from "@ory/client";
import { CHECK_ABILITY, RequiredRule } from "./ability.decorator";
import { AbilityFactory } from "./ability.factory";

@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactor: AbilityFactory,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules =
            this.reflector.get<RequiredRule[]>(
                CHECK_ABILITY,
                context.getHandler()
            ) || [];

        const request = context.switchToHttp().getRequest();
        const oryConfig = new Configuration({
            basePath: this.configService.get<string>("ory.url"),
            accessToken: this.configService.get<string>("access_token"),
        });
        const ory = new FrontendApi(oryConfig);
        const { data: session } = await ory.toSession({
            cookie: request.header("Cookie"),
        });
        const user = session.identity.traits;
        const ability = this.caslAbilityFactor.defineAbility(user);
        try {
            rules.forEach((rule) =>
                ForbiddenError.from(ability).throwUnlessCan(
                    rule.action,
                    rule.subject
                )
            );

            return true;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new UnauthorizedException(error.message);
            }
        }
    }
}
