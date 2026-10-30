import { BadRequestException } from "@nestjs/common";
import {
    assertAllowedClassification,
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
    it("allows an option of the methodology", () => {
        expect(() =>
            assertAllowedClassification(
                "rncd-debate",
                "trustworthy",
                "classification"
            )
        ).not.toThrow();
    });

    it("rejects a value outside the methodology", () => {
        expect(() =>
            assertAllowedClassification(
                "rncd-debate",
                "exaggerated",
                "classification"
            )
        ).toThrow(BadRequestException);
    });

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
