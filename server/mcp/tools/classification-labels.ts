import { isClassificationKey } from "../../../lib/classification";
import {
    getClassificationLabel,
    getMethodology,
    resolveMethodologyId,
} from "../../../lib/classification-methodology";

/**
 * MCP results carry stored keys ("trustworthy"), but their wording depends
 * on the methodology the review used. Next to every `classification` this
 * adds the resolved methodology, its name and the pt/en label. The
 * methodology comes from the same object or the nearest ancestor: a review
 * task keeps it at the top while its classification sits in
 * machine.context.reviewData.
 */
export function withClassificationLabels<T>(data: T): T {
    if (data === null || data === undefined) {
        return data;
    }
    const plain = JSON.parse(JSON.stringify(data));
    annotate(plain, undefined);
    return plain;
}

function annotate(node: unknown, inherited: string | undefined): void {
    if (Array.isArray(node)) {
        node.forEach((child) => annotate(child, inherited));
        return;
    }
    if (!node || typeof node !== "object") {
        return;
    }
    const record = node as Record<string, unknown>;
    const methodologyId =
        typeof record.classificationMethodology === "string"
            ? record.classificationMethodology
            : inherited;

    if (isClassificationKey(record.classification)) {
        const resolved = resolveMethodologyId(methodologyId);
        record.classificationMethodology = resolved;
        record.methodologyName = { ...getMethodology(resolved).name };
        record.classificationLabel = {
            pt: getClassificationLabel(resolved, record.classification, "pt"),
            en: getClassificationLabel(resolved, record.classification, "en"),
        };
    }

    Object.values(record).forEach((child) => annotate(child, methodologyId));
}
