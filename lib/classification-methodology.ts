import { ClassificationKey, isClassificationKey } from "./classification";

export type MethodologyLanguage = "pt" | "en";
type LocalizedText = Record<MethodologyLanguage, string>;

export interface ClassificationMethodologyOption {
    value: ClassificationKey;
    label: LocalizedText;
}

export interface ClassificationMethodology {
    name: LocalizedText;
    description: LocalizedText;
    options: ClassificationMethodologyOption[];
}

export const METHODOLOGY_IDS = ["aletheia", "rncd-debate"] as const;
export type MethodologyId = typeof METHODOLOGY_IDS[number];
export const DEFAULT_METHODOLOGY: MethodologyId = "aletheia";

// POC registry. The configurable step moves this to the database.
export const classificationMethodologies: Record<
    MethodologyId,
    ClassificationMethodology
> = {
    aletheia: {
        name: { pt: "Aletheia", en: "Aletheia" },
        description: {
            pt: "Escala de 9 classificações da Aletheia.",
            en: "Aletheia's 9-label classification scale.",
        },
        // Same order as the classification dropdown before methodologies
        options: [
            { value: "not-fact", label: { pt: "Não é fato", en: "Not fact" } },
            {
                value: "trustworthy",
                label: { pt: "Confiável", en: "Trustworthy" },
            },
            {
                value: "trustworthy-but",
                label: { pt: "Confiável, mas", en: "Trustworthy, but" },
            },
            { value: "arguable", label: { pt: "Discutível", en: "Arguable" } },
            {
                value: "misleading",
                label: { pt: "Enganoso", en: "Misleading" },
            },
            { value: "false", label: { pt: "Falso", en: "False" } },
            {
                value: "unsustainable",
                label: { pt: "Insustentável", en: "Unsustainable" },
            },
            {
                value: "exaggerated",
                label: { pt: "Exagerado", en: "Exaggerated" },
            },
            {
                value: "unverifiable",
                label: { pt: "Inverificável", en: "Unverifiable" },
            },
        ],
    },
    "rncd-debate": {
        name: { pt: "RNCD Debate", en: "RNCD Debate" },
        description: {
            pt: "Escala de 3 classificações da RNCD: Falso, Enganosa e Verdadeiro.",
            en: "RNCD's 3-label scale: False, Misleading and True.",
        },
        options: [
            { value: "false", label: { pt: "Falso", en: "False" } },
            {
                value: "misleading",
                label: { pt: "Enganosa", en: "Misleading" },
            },
            { value: "trustworthy", label: { pt: "Verdadeiro", en: "True" } },
        ],
    },
};

export function isMethodologyId(value: unknown): value is MethodologyId {
    return (
        typeof value === "string" &&
        (METHODOLOGY_IDS as readonly string[]).includes(value)
    );
}

// Records saved before methodologies existed have no id: they are aletheia.
export function resolveMethodologyId(id?: string | null): MethodologyId {
    return isMethodologyId(id) ? id : DEFAULT_METHODOLOGY;
}

export function getMethodology(id?: string | null): ClassificationMethodology {
    return classificationMethodologies[resolveMethodologyId(id)];
}

export function isAllowedClassification(
    id: string | null | undefined,
    value: unknown
): boolean {
    return getMethodology(id).options.some((option) => option.value === value);
}

export function toMethodologyLanguage(
    language?: string | null
): MethodologyLanguage {
    return language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/**
 * Wording of a stored classification under a methodology. A value the
 * methodology does not offer falls back to the aletheia wording; anything
 * that is not a ClassificationEnum key (e.g. "in-progress") is undefined so
 * callers can use their own text.
 */
export function getClassificationLabel(
    id: string | null | undefined,
    value: unknown,
    language?: string | null
): string | undefined {
    if (!isClassificationKey(value)) {
        return undefined;
    }
    const lang = toMethodologyLanguage(language);
    const option =
        getMethodology(id).options.find((o) => o.value === value) ??
        classificationMethodologies[DEFAULT_METHODOLOGY].options.find(
            (o) => o.value === value
        );
    return option?.label[lang];
}
