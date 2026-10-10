import { isValidClassification } from "./report.rules";

describe("report shared rules", () => {
    it("accepts a known classification and rejects anything else", () => {
        expect(isValidClassification("false")).toBe(true);
        expect(isValidClassification("trustworthy")).toBe(true);
        expect(isValidClassification("nope")).toBe(false);
        expect(isValidClassification(undefined)).toBe(false);
    });
});
