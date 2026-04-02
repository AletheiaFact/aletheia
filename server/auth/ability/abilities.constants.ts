import { Action } from "./ability.factory";
import { RequiredRule } from "./ability.decorator";
import { User } from "../../entities/user.entity";
import { M2M } from "../../entities/m2m.entity";

/**
 * Static ability definitions for use with @Auth(), @AdminOnly(), @FactCheckerOnly(), etc.
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
