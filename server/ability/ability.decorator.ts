import { SetMetadata } from "@nestjs/common";
import { User } from "../enities/user.entity";
import { Action, Subjects } from "./ability.factory";

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
