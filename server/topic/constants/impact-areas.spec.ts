import slugify from "slugify";
import {
    FALLBACK_IMPACT_AREA_SLUG,
    IMPACT_AREAS,
    findImpactArea,
    getFallbackImpactArea,
} from "./impact-areas";

const toSlug = (text: string) => slugify(text, { lower: true, strict: true });

describe("impact areas", () => {
    it("has slugs that match the slugified name", () => {
        IMPACT_AREAS.forEach((area) => {
            expect(area.slug).toBe(toSlug(area.name));
        });
    });

    it("never maps the same name or alias to two areas", () => {
        const keys = IMPACT_AREAS.flatMap((area) =>
            [area.name, ...area.aliases].map(toSlug)
        );
        expect(new Set(keys).size).toBe(keys.length);
    });

    it("includes the fallback area", () => {
        expect(getFallbackImpactArea().slug).toBe(FALLBACK_IMPACT_AREA_SLUG);
    });

    describe("findImpactArea", () => {
        it("finds an area by slug", () => {
            expect(findImpactArea("saude")?.name).toBe("Saúde");
        });

        it("finds an area by name ignoring case and accents", () => {
            expect(findImpactArea("SAUDE")?.slug).toBe("saude");
            expect(findImpactArea("meio ambiente")?.slug).toBe(
                "meio-ambiente"
            );
        });

        it("finds an area by alias", () => {
            expect(findImpactArea("Saúde e Bem-Estar")?.slug).toBe("saude");
        });

        it("accepts AI results and Wikidata options", () => {
            expect(
                findImpactArea({ name: "Segurança Pública", wikidataId: "Q1" } as any)
                    ?.slug
            ).toBe("seguranca-publica");
            expect(findImpactArea({ label: "Educação", value: "Q8434" } as any)?.slug).toBe(
                "educacao"
            );
        });

        it("returns undefined for areas outside the list", () => {
            expect(findImpactArea("Design de interiores")).toBeUndefined();
            expect(findImpactArea({ name: "" })).toBeUndefined();
            expect(findImpactArea(null)).toBeUndefined();
        });
    });
});
