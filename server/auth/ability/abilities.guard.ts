import { ForbiddenError } from "@casl/ability";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_ABILITY, RequiredRule } from "./ability.decorator";
import { AbilityFactory } from "./ability.factory";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { User } from "../../entities/user.entity";
import { M2M } from "../../entities/m2m.entity";
import { toError } from "../../util/error-handling";

@Injectable()
export class AbilitiesGuard implements CanActivate {
    protected readonly logger = new Logger(AbilitiesGuard.name);

    constructor(
        private reflector: Reflector,
        private caslAbilityFactor: AbilityFactory
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules =
            this.reflector.get<RequiredRule[]>(
                CHECK_ABILITY,
                context.getHandler()
            ) || [];

        const request = context.switchToHttp().getRequest();
        const subject: User | M2M | undefined = request.user;
        if (!subject) {
            // Not authenticated
            return false;
        }
        const nameSpaceSlug = request.params.namespace || NameSpaceEnum.Main;
        const ability = this.caslAbilityFactor.defineAbility(
            subject,
            nameSpaceSlug
        );

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

            const err = toError(error);
            this.logger.error(`Unexpected error: ${err.message}`, err.stack);

            throw err;
        }
    }
}
