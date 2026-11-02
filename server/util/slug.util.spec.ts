import { firstFreeSlug, slugVariantsFilter, toSlug } from "./slug.util";

describe("slug util", () => {
    it("derives a lowercase ascii slug", () => {
        expect(toSlug("  Agência Lupa! ")).toBe("agencia-lupa");
    });

    it("keeps the base when it is free", () => {
        expect(firstFreeSlug("lupa", new Set(["lupa-2"]))).toBe("lupa");
    });

    it("suffixes with the first free number", () => {
        expect(firstFreeSlug("lupa", new Set(["lupa", "lupa-2"]))).toBe(
            "lupa-3"
        );
    });

    it("matches only the base and its numeric variants, literally", () => {
        const { $regex } = slugVariantsFilter("a.b").slug;
        const pattern = new RegExp($regex);
        expect(pattern.test("a.b")).toBe(true);
        expect(pattern.test("a.b-12")).toBe(true);
        expect(pattern.test("axb")).toBe(false);
        expect(pattern.test("a.b-c")).toBe(false);
    });
});
