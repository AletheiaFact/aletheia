import { IMPACT_AREAS } from "../constants/impact-areas";
import {
    buildTopicFromInput,
    buildTopicFromTopicData,
    deriveTopicSlug,
    escapeRegex,
    findMatchedAlias,
    listImpactAreas,
    normalizeText,
    toExistingTopicRef,
    topicInputSlugSource,
} from "./topic.rules";

describe("topic shared rules", () => {
    it("deriveTopicSlug lower-cases and strips special characters", () => {
        expect(deriveTopicSlug("Saúde Pública!")).toBe("saude-publica");
        expect(deriveTopicSlug("  Meio Ambiente ")).toBe("meio-ambiente");
    });

    it("normalizeText strips diacritics only", () => {
        expect(normalizeText("Educação")).toBe("Educacao");
        expect(normalizeText("plain")).toBe("plain");
    });

    it("escapeRegex neutralizes regex metacharacters", () => {
        expect(new RegExp(`^${escapeRegex("a.b*c")}$`).test("a.b*c")).toBe(
            true
        );
        expect(new RegExp(`^${escapeRegex("a.b*c")}$`).test("axbbc")).toBe(
            false
        );
    });

    it("listImpactAreas returns name and slug of every closed-list area", () => {
        expect(listImpactAreas()).toEqual(
            IMPACT_AREAS.map(({ name, slug }) => ({ name, slug }))
        );
    });

    it("findMatchedAlias matches accent- and case-insensitively, else null", () => {
        expect(findMatchedAlias(["Saúde", "Educação"], "educacao")).toBe(
            "Educação"
        );
        expect(findMatchedAlias(["Saúde"], "xyz")).toBeNull();
        expect(findMatchedAlias(undefined, "x")).toBeNull();
    });

    it("topicInputSlugSource prefers label, then slug, then the bare string", () => {
        expect(topicInputSlugSource({ label: "A", slug: "b" })).toBe("A");
        expect(topicInputSlugSource({ slug: "b" })).toBe("b");
        expect(topicInputSlugSource("c")).toBe("c");
    });

    it("buildTopicFromInput handles wikidata picks and bare strings", () => {
        expect(
            buildTopicFromInput(
                { label: "Saúde", value: "Q1", aliases: ["Health"] },
                "saude",
                "pt"
            )
        ).toEqual({
            name: "Saúde",
            wikidataId: "Q1",
            aliases: ["Health"],
            slug: "saude",
            language: "pt",
        });
        expect(buildTopicFromInput("Plain", "plain", "en")).toEqual({
            name: "Plain",
            wikidataId: undefined,
            aliases: [],
            slug: "plain",
            language: "en",
        });
    });

    it("buildTopicFromTopicData derives slug, defaults language, falls back to value", () => {
        expect(buildTopicFromTopicData({ name: "Meio Ambiente" })).toEqual({
            name: "Meio Ambiente",
            slug: "meio-ambiente",
            language: "pt",
            wikidataId: undefined,
        });
        expect(
            buildTopicFromTopicData({ name: "X", value: "Q9", language: "en" })
        ).toMatchObject({ language: "en", wikidataId: "Q9" });
        expect(
            buildTopicFromTopicData({
                name: "X",
                wikidataId: "Q1",
                value: "Q9",
            })
        ).toMatchObject({ wikidataId: "Q1" });
    });

    it("toExistingTopicRef returns {id,label,value} for wikidata topics, slug otherwise", () => {
        expect(
            toExistingTopicRef({
                _id: "1",
                name: "A",
                wikidataId: "Q1",
                slug: "a",
            })
        ).toEqual({ id: "1", label: "A", value: "Q1" });
        expect(
            toExistingTopicRef({
                _id: "1",
                name: "A",
                wikidataId: null,
                slug: "a",
            })
        ).toBe("a");
    });
});
