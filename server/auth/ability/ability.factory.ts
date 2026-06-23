import { Injectable } from "@nestjs/common";
import {
    Ability,
    AbilityBuilder,
    AbilityClass,
    ExtractSubjectType,
    InferSubjects,
} from "@casl/ability";
import { User } from "../../entities/user.entity";
import { M2M } from "../../entities/m2m.entity";

export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
}

export enum Roles {
    Regular = "regular", //read
    FactChecker = "fact-checker", //read, create, update
    Admin = "admin", //manage
    SuperAdmin = "super-admin", //Manage / Not editable
    Reviewer = "reviewer", // //read, create, update
    Integration = "integration",
}

export enum Status {
    Inactive = "inactive",
    Active = "active",
}

export type Subjects = InferSubjects<typeof User | typeof M2M> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
    defineAbility(subject: User | M2M, nameSpace: string): AppAbility {
        const { can, cannot, build } = new AbilityBuilder(
            Ability as AbilityClass<AppAbility>
        );

        const role = subject.role as Record<string, string>;
        if (subject.isM2M && role[nameSpace] === Roles.Integration) {
            can(Action.Create, "all");
        } else {
            if (
                role[nameSpace] === Roles.Admin ||
                role[nameSpace] === Roles.SuperAdmin
            ) {
                can(Action.Manage, "all");
            } else if (
                role[nameSpace] === Roles.FactChecker ||
                role[nameSpace] === Roles.Reviewer
            ) {
                can(Action.Read, "all");
                can(Action.Update, "all");
                can(Action.Create, "all");
            } else {
                can(Action.Read, "all");
                cannot(Action.Create, "all").because(
                    "special message: only admins!"
                );
            }
        }

        return build({
            detectSubjectType: (item: Record<string, any>) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
