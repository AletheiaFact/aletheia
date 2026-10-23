import { isClassificationKey } from "../../../lib/classification";
import {
    DEFAULT_METHODOLOGY,
    getClassificationLabel,
    getMethodology,
    resolveMethodologyId,
} from "../../../lib/classification-methodology";

/** Appended to the description of every tool whose result is labelled here. */
export const CLASSIFICATION_LABELS_NOTE =
    " Classified items include classificationMethodology, methodologyName and classificationLabel: report the label with its methodology. Review stats combine all methodologies and carry an aletheia-worded classificationLabel (labelMethodology).";

/**
 * MCP results carry stored keys ("trustworthy"), but their wording depends
 * on the methodology the review used. Next to every `classification` this
 * adds the resolved methodology, its name and the pt/en label. The
 * methodology comes from the same object or the nearest ancestor: a review
 * task keeps it at the top while its classification sits in
 * machine.context.reviewData.
 *
 * Review stats entries ({ _id: key, count }) combine every methodology, so,
 * as on the web, they get the aletheia wording and say so (labelMethodology).
 */
export function withClassificationLabels<T>(data: T): T {
    if (data === null || data === undefined) {
        return data;
    }
    const plain = JSON.parse(JSON.stringify(data));
    annotate(plain, undefined);
    return plain;
}

const labels = (methodologyId: string, key: string) => ({
    pt: getClassificationLabel(methodologyId, key, "pt"),
    en: getClassificationLabel(methodologyId, key, "en"),
});

// Stats group by the stored key: { _id: "false", count } or, before
// formatting, { _id: ["false"], count }
function statsKey(record: Record<string, unknown>): string | undefined {
    if (typeof record.count !== "number") {
        return undefined;
    }
    const id = Array.isArray(record._id) ? record._id[0] : record._id;
    return isClassificationKey(id) ? id : undefined;
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
        record.classificationLabel = labels(resolved, record.classification);
    }

    const key = statsKey(record);
    if (key) {
        record.classificationLabel = labels(DEFAULT_METHODOLOGY, key);
        record.labelMethodology = DEFAULT_METHODOLOGY;
    }

    Object.values(record).forEach((child) => annotate(child, methodologyId));
}
