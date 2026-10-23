// Classification that publishes without report content (mirrors
// src/machines/reviewTask/validation.ts).
const NOT_FACT_CLASSIFICATION = "not-fact";

/**
 * Server-side mirror of the publish checks in
 * src/machines/reviewTask/validation.ts, applied to the stored report.
 */
export function missingPublishFields(reviewData: any): string[] {
    const missing: string[] = [];
    const isBlank = (value: unknown) =>
        Array.isArray(value)
            ? value.length === 0
            : typeof value !== "string" || !value.trim();
    if (isBlank(reviewData.classification)) missing.push("classification");
    if (isBlank(reviewData.summary)) missing.push("summary");
    if (reviewData.classification !== NOT_FACT_CLASSIFICATION) {
        for (const field of ["report", "verification", "questions"]) {
            if (isBlank(reviewData[field])) missing.push(field);
        }
    }
    if (isBlank(reviewData.sources)) missing.push("sources");
    return missing;
}
