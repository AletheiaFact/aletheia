import {
    EMPTY_FILTERS,
    clearedFilters,
    hasActiveFilters,
    parseFilters,
    toReviewParams,
    toSearchParams,
} from "./repositoryFilters";

describe("repository filters: methodology", () => {
    it("defaults to aletheia", () => {
        expect(parseFilters({}).methodology).toBe("aletheia");
        expect(parseFilters({ methodology: "unknown" }).methodology).toBe(
            "aletheia"
        );
        expect(parseFilters({ methodology: "rncd-debate" }).methodology).toBe(
            "rncd-debate"
        );
    });

    it("only rewords the labels: it is never sent to the API", () => {
        const params = toReviewParams({
            ...EMPTY_FILTERS,
            methodology: "rncd-debate",
            classification: ["unverifiable"],
        });
        expect(params).not.toHaveProperty("classificationMethodology");
        expect(params.classification).toEqual(["unverifiable"]);
    });

    it("is not an active filter, and clearing keeps it", () => {
        const filters = {
            ...EMPTY_FILTERS,
            methodology: "rncd-debate" as const,
            order: "asc" as const,
        };
        expect(hasActiveFilters(filters)).toBe(false);
        expect(
            hasActiveFilters({ ...filters, classification: ["false"] })
        ).toBe(true);
        expect(
            clearedFilters({ ...filters, classification: ["false"] })
        ).toEqual(filters);
    });

    it("is kept in the URL only when it is not the default", () => {
        expect(
            toSearchParams("reviews", EMPTY_FILTERS).has("methodology")
        ).toBe(false);
        expect(
            toSearchParams("reviews", {
                ...EMPTY_FILTERS,
                methodology: "rncd-debate",
            }).get("methodology")
        ).toBe("rncd-debate");
    });
});
