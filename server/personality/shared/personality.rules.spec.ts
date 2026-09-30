import { deriveSlug, defaultDescription } from "./personality.rules";

describe("personality shared rules", () => {
    describe("deriveSlug", () => {
        it("lowercases and hyphenates", () => {
            expect(deriveSlug("Ada Lovelace")).toBe("ada-lovelace");
        });

        it("strips special characters (strict mode)", () => {
            expect(deriveSlug("José D'Ávila Jr.")).toBe("jose-davila-jr");
        });
    });

    describe("defaultDescription", () => {
        it("uses the wikidata description when provided", () => {
            expect(defaultDescription("Ada", "Mathematician")).toBe(
                "Mathematician"
            );
        });

        it("falls back to the templated default when missing or empty", () => {
            expect(defaultDescription("Ada", undefined)).toBe(
                "Personality: Ada"
            );
            expect(defaultDescription("Ada", null)).toBe("Personality: Ada");
            expect(defaultDescription("Ada", "")).toBe("Personality: Ada");
        });
    });
});
