import { SetMetadata } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { Action, Subjects } from "./ability.factory";
import { M2M } from "../../entities/m2m.entity";

export interface RequiredRule {
    action: Action;
    subject: Subjects;
}

export const CHECK_ABILITY = "check_ability";

/**
 * @deprecated When used with @UseGuards(AbilitiesGuard), use @Auth({ abilities: [...] }) instead
 *
 * This decorator is deprecated when used directly in controllers.
 * It's still used internally by the unified Auth decorator.
 *
 * Migration:
 * ```typescript
 * // Before:
 * @UseGuards(AbilitiesGuard)
 * @CheckAbilities(new AdminUserAbility())
 *
 * // After:
 * import { AdminOnly } from "../auth/decorators/auth.decorator";
 * @AdminOnly()
 * ```
 *
 * See: server/auth/AUTH_DECORATOR_MIGRATION.md for full migration guide
 */
export const CheckAbilities = (...requirements: RequiredRule[]) =>
    SetMetadata(CHECK_ABILITY, requirements);

export class RegularUserAbility implements RequiredRule {
    action = Action.Read;
    subject = User;
}

export class FactCheckerUserAbility implements RequiredRule {
    action = Action.Create || Action.Update;
    subject = User;
}

export class AdminUserAbility implements RequiredRule {
    action = Action.Manage;
    subject = User;
}

export class IntegrationAbility implements RequiredRule {
    action = Action.Create;
    subject = M2M;
}
