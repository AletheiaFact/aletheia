import { BadRequestException, ForbiddenException } from "@nestjs/common";
import {
    assertAllowedClassification,
    resolveMethodologySwitch,
    resolveNewTaskMethodology,
} from "./classification-methodology.rules";

describe("resolveNewTaskMethodology", () => {
    it("defaults to aletheia when nothing is requested", () => {
        expect(resolveNewTaskMethodology(undefined, false)).toBe("aletheia");
        expect(resolveNewTaskMethodology("", true)).toBe("aletheia");
    });

    it("accepts aletheia even with the flag off", () => {
        expect(resolveNewTaskMethodology("aletheia", false)).toBe("aletheia");
    });

    it("accepts a non-default methodology only with the flag on", () => {
        expect(resolveNewTaskMethodology("rncd-debate", true)).toBe(
            "rncd-debate"
        );
        expect(() => resolveNewTaskMethodology("rncd-debate", false)).toThrow(
            BadRequestException
        );
    });

    it("rejects an unknown methodology", () => {
        expect(() => resolveNewTaskMethodology("nope", true)).toThrow(
            /Unknown classification methodology/
        );
    });
});

describe("assertAllowedClassification", () => {
    it.each(["false", "trustworthy-but", "unverifiable", "trustworthy"])(
        "allows %s, an option of the methodology",
        (value) => {
            expect(() =>
                assertAllowedClassification(
                    "rncd-debate",
                    value,
                    "classification"
                )
            ).not.toThrow();
        }
    );

    it.each(["exaggerated", "misleading"])(
        "rejects %s, a value outside the methodology",
        (value) => {
            expect(() =>
                assertAllowedClassification(
                    "rncd-debate",
                    value,
                    "classification"
                )
            ).toThrow(BadRequestException);
        }
    );

    it("treats a missing methodology as aletheia", () => {
        expect(() =>
            assertAllowedClassification(
                undefined,
                "exaggerated",
                "classification"
            )
        ).not.toThrow();
    });

    it("leaves empty values to the existing validation", () => {
        expect(() =>
            assertAllowedClassification("rncd-debate", "", "classification")
        ).not.toThrow();
        expect(() =>
            assertAllowedClassification(
                "rncd-debate",
                undefined,
                "classification"
            )
        ).not.toThrow();
    });
});

describe("resolveMethodologySwitch", () => {
    const input = (overrides = {}) => ({
        stored: "aletheia",
        requested: "rncd-debate",
        fromState: "reported",
        toState: "assigned",
        isAdmin: true,
        enabled: true,
        ...overrides,
    });

    it("switches when an admin reassigns", () => {
        expect(resolveMethodologySwitch(input())).toBe("rncd-debate");
    });

    it("switches for anyone taking a queued task", () => {
        expect(
            resolveMethodologySwitch(
                input({ fromState: "unassigned", isAdmin: false })
            )
        ).toBe("rncd-debate");
    });

    it("refuses a non-admin reassignment", () => {
        expect(() =>
            resolveMethodologySwitch(input({ isAdmin: false }))
        ).toThrow(ForbiddenException);
    });

    it.each([
        ["no request", { requested: undefined }],
        ["the same methodology", { requested: "aletheia" }],
        ["a save that is not an assignment", { toState: "reported" }],
        ["a published task", { fromState: "published" }],
    ])("keeps the stored one for %s", (_case, overrides) => {
        expect(resolveMethodologySwitch(input(overrides))).toBeUndefined();
    });

    it("treats a task without one as aletheia", () => {
        expect(
            resolveMethodologySwitch(
                input({ stored: undefined, requested: "aletheia" })
            )
        ).toBeUndefined();
    });

    it("keeps an unchanged non-default methodology after the flag is off", () => {
        expect(
            resolveMethodologySwitch(
                input({
                    stored: "rncd-debate",
                    requested: "rncd-debate",
                    enabled: false,
                })
            )
        ).toBeUndefined();
    });

    it("refuses switching to a non-default methodology while the flag is off", () => {
        expect(() =>
            resolveMethodologySwitch(input({ enabled: false }))
        ).toThrow(BadRequestException);
    });
});
