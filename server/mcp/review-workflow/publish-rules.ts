import { ClassificationEnum } from "../../claim-review/dto/create-claim-review.dto";

// Classification that publishes without report content (mirrors
// src/machines/reviewTask/validation.ts).
const NOT_FACT_CLASSIFICATION = "not-fact";

const CLASSIFICATIONS = new Set(
    Object.keys(ClassificationEnum).filter((key) => Number.isNaN(Number(key)))
);

/**
 * Server-side mirror of the checks the web runs on finishReport and publish
 * (src/machines/reviewTask/validation.ts), applied to the stored report.
 * Unlike the web, the summary is required for `not-fact` too: the manual
 * asks for the description of the checked content in every review.
 */
export function missingReportFields(reviewData: any): string[] {
    const missing: string[] = [];
    const isBlank = (value: unknown) =>
        Array.isArray(value)
            ? value.length === 0
            : typeof value !== "string" || !value.trim();
    if (!CLASSIFICATIONS.has(reviewData.classification)) {
        missing.push("classification");
    }
    if (isBlank(reviewData.summary)) missing.push("summary");
    if (reviewData.classification !== NOT_FACT_CLASSIFICATION) {
        for (const field of ["report", "verification", "questions"]) {
            if (isBlank(reviewData[field])) missing.push(field);
        }
    }
    if (isBlank(reviewData.sources)) missing.push("sources");
    return missing;
}
