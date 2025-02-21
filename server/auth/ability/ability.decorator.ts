import { SetMetadata } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { Action, Subjects } from "./ability.factory";
import { M2M } from "../../entities/m2m.entity";

export interface RequiredRule {
    action: Action;
    subject: Subjects;
}

export const CHECK_ABILITY = "check_ability";

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
