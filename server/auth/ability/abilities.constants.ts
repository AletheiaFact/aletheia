import { Action } from "./ability.factory";
import { RequiredRule } from "./ability.decorator";
import { User } from "../../entities/user.entity";
import { M2M } from "../../entities/m2m.entity";

/**
 * Static ability definitions for clean decorator usage.
 * @M2MOrAbilities(ADMIN_USER_ABILITY)
 * @UseGuards(AbilitiesGuard)
 * @CheckAbilities(ADMIN_USER_ABILITY)
 */

export const ADMIN_USER_ABILITY: RequiredRule = {
    action: Action.Manage,
    subject: User,
};

export const FACT_CHECKER_ABILITY: RequiredRule = {
    action: Action.Create || Action.Update,
    subject: User,
};

export const REGULAR_USER_ABILITY: RequiredRule = {
    action: Action.Read,
    subject: User,
};

export const INTEGRATION_ABILITY: RequiredRule = {
    action: Action.Create,
    subject: M2M,
};
