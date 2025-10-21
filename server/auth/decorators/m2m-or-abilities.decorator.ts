import {
    UseGuards,
    applyDecorators,
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ForbiddenError } from "@casl/ability";
import { AbilityFactory, Roles } from "../ability/ability.factory";
import {
    CHECK_ABILITY,
    RequiredRule,
    CheckAbilities,
} from "../ability/ability.decorator";
import { NameSpaceEnum } from "../name-space/schemas/name-space.schema";
import { User } from "../../entities/user.entity";
import { M2M } from "../../entities/m2m.entity";

@Injectable()
export class M2MOrAbilitiesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: AbilityFactory
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

/**
 * @deprecated Use @Auth({ abilities: [...], allowM2M: true }) or @AdminOnly({ allowM2M: true }) instead
 *
 * This decorator is deprecated in favor of the unified Auth decorator pattern.
 *
 * Migration:
 * ```typescript
 * // Before:
 * @M2MOrAbilities(new AdminUserAbility())
 *
 * // After:
 * import { AdminOnly } from "../auth/decorators/auth.decorator";
 * @AdminOnly({ allowM2M: true })
 * ```
 *
 * See: server/auth/AUTH_DECORATOR_MIGRATION.md for full migration guide
 */
export const M2MOrAbilities = (...requirements: RequiredRule[]) => {
    return applyDecorators(
        UseGuards(M2MOrAbilitiesGuard),
        CheckAbilities(...requirements)
    );
};
