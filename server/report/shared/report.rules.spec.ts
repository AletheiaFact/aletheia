import {
    isValidClassification,
    withReportClassification,
} from "./report.rules";

describe("report shared rules", () => {
    it("accepts a known classification and rejects anything else", () => {
        expect(isValidClassification("false")).toBe(true);
        expect(isValidClassification("trustworthy")).toBe(true);
        expect(isValidClassification("nope")).toBe(false);
        expect(isValidClassification(undefined)).toBe(false);
    });

    it("withReportClassification puts the report fields under the stored props", () => {
        expect(
            withReportClassification(
                { id: 1 },
                {
                    classification: "false",
                    classificationMethodology: "rncd-debate",
                }
            )
        ).toEqual({
            classification: "false",
            classificationMethodology: "rncd-debate",
            id: 1,
        });
        expect(
            withReportClassification(
                { classification: "stored" },
                { classification: "false" }
            ).classification
        ).toBe("stored");
        expect(withReportClassification(undefined, null)).toEqual({
            classification: undefined,
            classificationMethodology: undefined,
        });
    });
});
