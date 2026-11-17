import { ClassificationEnum } from "../../../lib/classification";

export function isValidClassification(classification: unknown): boolean {
    return Object.values(ClassificationEnum).includes(
        classification as ClassificationEnum
    );
}

/**
 * Content props as public reads return them: the report's classification and
 * methodology first, so a value already stored on the content wins.
 */
export function withReportClassification(
    props: Record<string, any> | undefined,
    report:
        | { classification?: string; classificationMethodology?: string }
        | null
        | undefined
): Record<string, any> {
    return {
        classification: report?.classification,
        classificationMethodology:
            report?.classificationMethodology ?? undefined,
        ...props,
    };
}
