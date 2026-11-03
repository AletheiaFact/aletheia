// Canonical classification keys. Reports, claim reviews and source props
// always store one of these keys; a methodology only changes which keys are
// offered and how they are worded (see classification-methodology.ts).
// The numeric values feed the schema.org ratingValue: never reorder them.
export enum ClassificationEnum {
    "not-fact" = 0,
    "false",
    "misleading",
    "unsustainable",
    "unverifiable",
    "exaggerated",
    "arguable",
    "trustworthy-but",
    "trustworthy",
}

export type ClassificationKey = keyof typeof ClassificationEnum;

export function isClassificationKey(
    value: unknown
): value is ClassificationKey {
    return (
        typeof value === "string" &&
        typeof ClassificationEnum[value as ClassificationKey] === "number"
    );
}
