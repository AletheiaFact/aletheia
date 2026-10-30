import { readFileSync } from "fs";
import { join } from "path";
import { ClassificationEnum, isClassificationKey } from "./classification";
import {
    METHODOLOGY_IDS,
    classificationMethodologies,
    getClassificationLabel,
    getMethodology,
    isAllowedClassification,
    isMethodologyId,
    resolveMethodologyId,
    toMethodologyLanguage,
} from "./classification-methodology";

const localeMessages = (lang: "pt" | "en") =>
    JSON.parse(
        readFileSync(
            join(process.cwd(), `public/locales/${lang}/claimReviewForm.json`),
            "utf8"
        )
    );

const enumKeys = Object.keys(ClassificationEnum).filter((key) =>
    isNaN(Number(key))
);

describe("classification methodologies", () => {
    it("registers exactly the ids in METHODOLOGY_IDS", () => {
        expect(Object.keys(classificationMethodologies).sort()).toEqual(
            [...METHODOLOGY_IDS].sort()
        );
    });

    it.each([...METHODOLOGY_IDS])(
        "%s only uses ClassificationEnum keys, each once",
        (id) => {
            const values = classificationMethodologies[id].options.map(
                (option) => option.value
            );
            values.forEach((value) =>
                expect(isClassificationKey(value)).toBe(true)
            );
            expect(new Set(values).size).toBe(values.length);
        }
    );

    it("aletheia offers all 9 keys in today's dropdown order", () => {
        const values = getMethodology("aletheia").options.map((o) => o.value);
        expect([...values].sort()).toEqual([...enumKeys].sort());
        expect(values).toEqual([
            "not-fact",
            "trustworthy",
            "trustworthy-but",
            "arguable",
            "misleading",
            "false",
            "unsustainable",
            "exaggerated",
            "unverifiable",
        ]);
    });

    it.each(["pt", "en"] as const)(
        "aletheia labels match the %s claimReviewForm locale",
        (lang) => {
            const messages = localeMessages(lang);
            getMethodology("aletheia").options.forEach((option) =>
                expect(option.label[lang]).toBe(messages[option.value])
            );
        }
    );

    it("rncd-debate maps Falso, Enganosa and Verdadeiro", () => {
        expect(
            getMethodology("rncd-debate").options.map((o) => [
                o.value,
                o.label.pt,
                o.label.en,
            ])
        ).toEqual([
            ["false", "Falso", "False"],
            ["misleading", "Enganosa", "Misleading"],
            ["trustworthy", "Verdadeiro", "True"],
        ]);
    });

    it("falls back to aletheia for missing or unknown ids", () => {
        expect(resolveMethodologyId(undefined)).toBe("aletheia");
        expect(resolveMethodologyId(null)).toBe("aletheia");
        expect(resolveMethodologyId("nope")).toBe("aletheia");
        expect(resolveMethodologyId("rncd-debate")).toBe("rncd-debate");
        expect(isMethodologyId("rncd-debate")).toBe(true);
        expect(isMethodologyId("nope")).toBe(false);
    });

    it("isAllowedClassification follows the methodology's options", () => {
        expect(isAllowedClassification("rncd-debate", "trustworthy")).toBe(
            true
        );
        expect(isAllowedClassification("rncd-debate", "exaggerated")).toBe(
            false
        );
        expect(isAllowedClassification(undefined, "exaggerated")).toBe(true);
        expect(isAllowedClassification("aletheia", "in-progress")).toBe(false);
    });

    it("getClassificationLabel resolves wording per methodology and language", () => {
        expect(getClassificationLabel("rncd-debate", "trustworthy", "pt")).toBe(
            "Verdadeiro"
        );
        expect(
            getClassificationLabel("rncd-debate", "trustworthy", "en-US")
        ).toBe("True");
        expect(getClassificationLabel(undefined, "trustworthy", "pt")).toBe(
            "Confiável"
        );
        // A value outside the methodology falls back to the aletheia wording
        expect(getClassificationLabel("rncd-debate", "exaggerated", "pt")).toBe(
            "Exagerado"
        );
        expect(
            getClassificationLabel("rncd-debate", "in-progress", "pt")
        ).toBeUndefined();
    });

    it("toMethodologyLanguage maps any pt locale to pt and the rest to en", () => {
        expect(toMethodologyLanguage("pt")).toBe("pt");
        expect(toMethodologyLanguage("pt-BR")).toBe("pt");
        expect(toMethodologyLanguage("en")).toBe("en");
        expect(toMethodologyLanguage(undefined)).toBe("en");
    });
});
