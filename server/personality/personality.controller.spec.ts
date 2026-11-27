import {
    CHECK_ABILITY,
    AdminUserAbility,
    FactCheckerUserAbility,
} from "../auth/ability/ability.decorator";
import { PersonalityController } from "./personality.controller";

const abilitiesOf = (method: keyof PersonalityController) =>
    Reflect.getMetadata(
        CHECK_ABILITY,
        PersonalityController.prototype[method] as any
    );

describe("PersonalityController access", () => {
    it("create needs a fact-checker", () => {
        expect(abilitiesOf("create")[0]).toBeInstanceOf(FactCheckerUserAbility);
    });
    it("update needs an admin", () => {
        expect(abilitiesOf("update")[0]).toBeInstanceOf(AdminUserAbility);
    });
    it("getStored needs an admin", () => {
        expect(abilitiesOf("getStored")[0]).toBeInstanceOf(AdminUserAbility);
    });
});
