import { AbilityFactory, Action, Roles } from "./ability.factory";
import { User } from "../../entities/user.entity";
import { M2M } from "../../entities/m2m.entity";

describe("AbilityFactory", () => {
    let factory: AbilityFactory;

    beforeAll(() => {
        factory = new AbilityFactory();
    });

    const createUser = (role: string): User => {
        const user = new User();
        user.isM2M = false;
        user.role = { main: role };
        return user;
    };

    const createM2M = (): M2M => {
        const m2m = new M2M();
        m2m.isM2M = true;
        m2m.role = { main: Roles.Integration };
        return m2m;
    };

    describe("Admin role", () => {
        it("should grant Manage ability on all subjects", () => {
            const user = createUser(Roles.Admin);
            const ability = factory.defineAbility(user, "main");

            expect(ability.can(Action.Manage, "all")).toBe(true);
            expect(ability.can(Action.Create, "all")).toBe(true);
            expect(ability.can(Action.Read, "all")).toBe(true);
            expect(ability.can(Action.Update, "all")).toBe(true);
            expect(ability.can(Action.Delete, "all")).toBe(true);
        });
    });

    describe("SuperAdmin role", () => {
        it("should grant Manage ability on all subjects", () => {
            const user = createUser(Roles.SuperAdmin);
            const ability = factory.defineAbility(user, "main");

            expect(ability.can(Action.Manage, "all")).toBe(true);
        });
    });

    describe("FactChecker role", () => {
        it("should grant Read, Create, Update but not Manage or Delete", () => {
            const user = createUser(Roles.FactChecker);
            const ability = factory.defineAbility(user, "main");

            expect(ability.can(Action.Read, "all")).toBe(true);
            expect(ability.can(Action.Create, "all")).toBe(true);
            expect(ability.can(Action.Update, "all")).toBe(true);
            expect(ability.can(Action.Manage, "all")).toBe(false);
        });
    });

    describe("Reviewer role", () => {
        it("should grant Read, Create, Update but not Manage or Delete", () => {
            const user = createUser(Roles.Reviewer);
            const ability = factory.defineAbility(user, "main");

            expect(ability.can(Action.Read, "all")).toBe(true);
            expect(ability.can(Action.Create, "all")).toBe(true);
            expect(ability.can(Action.Update, "all")).toBe(true);
            expect(ability.can(Action.Manage, "all")).toBe(false);
        });
    });

    describe("Regular role", () => {
        it("should grant only Read ability", () => {
            const user = createUser(Roles.Regular);
            const ability = factory.defineAbility(user, "main");

            expect(ability.can(Action.Read, "all")).toBe(true);
            expect(ability.can(Action.Create, "all")).toBe(false);
            expect(ability.can(Action.Update, "all")).toBe(false);
            expect(ability.can(Action.Manage, "all")).toBe(false);
        });
    });

    describe("Integration (M2M) role", () => {
        it("should grant only Create ability", () => {
            const m2m = createM2M();
            const ability = factory.defineAbility(m2m, "main");

            expect(ability.can(Action.Create, "all")).toBe(true);
            expect(ability.can(Action.Read, "all")).toBe(false);
            expect(ability.can(Action.Manage, "all")).toBe(false);
        });
    });

    describe("namespace-based roles", () => {
        it("should use the correct namespace to resolve the role", () => {
            const user = new User();
            user.isM2M = false;
            user.role = { main: Roles.Regular } as any;
            (user.role as any)["custom-ns"] = Roles.Admin;

            const ability = factory.defineAbility(user, "custom-ns");
            expect(ability.can(Action.Manage, "all")).toBe(true);
        });

        it("should fall back to Regular-like permissions when namespace role is undefined", () => {
            const user = createUser(Roles.Regular);
            const ability = factory.defineAbility(user, "nonexistent-ns");

            expect(ability.can(Action.Read, "all")).toBe(true);
            expect(ability.can(Action.Create, "all")).toBe(false);
        });
    });
});
