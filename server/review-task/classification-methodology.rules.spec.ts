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
