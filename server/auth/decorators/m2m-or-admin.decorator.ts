import {
    UseGuards,
    applyDecorators,
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ForbiddenError } from "@casl/ability";
import { AbilityFactory } from "../ability/ability.factory";
import {
    CHECK_ABILITY,
    RequiredRule,
    CheckAbilities,
} from "../ability/ability.decorator";
import { NameSpaceEnum } from "../name-space/schemas/name-space.schema";
import { User } from "../../entities/user.entity";
import { Roles } from "../ability/ability.factory";
import { M2M } from "../../entities/m2m.entity";

@Injectable()
export class M2MOrAbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const subject: User | M2M | undefined = request.user;

        if (!subject) {
            return false;
        }

        if (subject.isM2M && subject.role?.main === Roles.Integration) {
            return true;
        }

        const rules =
            this.reflector.get<RequiredRule[]>(
                CHECK_ABILITY,
                context.getHandler()
            ) || [];

        if (rules.length === 0) {
            return true;
        }

        const nameSpaceSlug = request.params.namespace || NameSpaceEnum.Main;
        const ability = this.caslAbilityFactory.defineAbility(
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
            throw error;
        }
    }
}

export const M2MOrAdmin = (...requirements: RequiredRule[]) => {
    return applyDecorators(
        UseGuards(M2MOrAbilitiesGuard),
        CheckAbilities(...requirements)
    );
};
