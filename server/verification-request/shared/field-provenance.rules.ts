import {
    FieldProvenance,
    FieldProvenanceMap,
    ProvenanceOrigin,
    TriageField,
} from "../dto/types";

export const TRIAGE_FIELDS: readonly string[] = Object.values(TriageField);

export function isTriageField(field: string): field is TriageField {
    return TRIAGE_FIELDS.includes(field);
}

/**
 * Brings a triage value to a backend-neutral shape: references become id
 * strings (populated documents included) and lists are sorted, since the
 * order of topics and personalities carries no meaning.
 */
export function normalizeTriageValue(value: any): any {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) {
        return value.map(normalizeTriageValue).sort();
    }
    if (typeof value === "object") {
        return String(value._id ?? value.id ?? value);
    }
    return value;
}

export function sameTriageValue(a: any, b: any): boolean {
    return (
        JSON.stringify(normalizeTriageValue(a)) ===
        JSON.stringify(normalizeTriageValue(b))
    );
}

export function isHumanOwned(provenance?: FieldProvenance): boolean {
    return (
        provenance?.origin === ProvenanceOrigin.HUMAN ||
        provenance?.origin === ProvenanceOrigin.AI_EDITED_BY_HUMAN
    );
}

/**
 * Provenance of a value sent with the request. It does not make the field
 * human owned: the AI triage still replaces it, as it always did.
 */
export function creationProvenance(
    value: any,
    sentByIntegration: boolean
): FieldProvenance {
    return {
        origin: sentByIntegration
            ? ProvenanceOrigin.INTEGRATION
            : ProvenanceOrigin.REPORTER,
        reporterValue: normalizeTriageValue(value),
    };
}

/**
 * Provenance after the AI answers a field. A field a human already owns
 * keeps its origin and only records the AI answer for comparison.
 */
export function aiProvenance(
    previous: FieldProvenance | undefined,
    ai: { value: any; taskId?: string; model?: string; at: Date }
): FieldProvenance {
    const aiFields = {
        aiValue: normalizeTriageValue(ai.value),
        aiTaskId: ai.taskId,
        aiModel: ai.model,
        aiAt: ai.at,
    };
    if (previous && isHumanOwned(previous)) {
        return { ...previous, ...aiFields };
    }
    return { ...previous, origin: ProvenanceOrigin.AI, ...aiFields };
}

/**
 * Provenance after a human sets a field. It counts as an edit of the AI
 * triage only when the AI had answered that field before.
 */
export function humanProvenance(
    previous: FieldProvenance | undefined,
    human: { userId?: string; at: Date }
): FieldProvenance {
    const answeredByAi = previous?.aiValue !== undefined;
    return {
        ...previous,
        origin: answeredByAi
            ? ProvenanceOrigin.AI_EDITED_BY_HUMAN
            : ProvenanceOrigin.HUMAN,
        humanUserId: human.userId ? String(human.userId) : undefined,
        humanAt: human.at,
    };
}

/**
 * Provenance entries for the triage fields a human update actually changes.
 * Fields left out of `after`, or set to the value they already had, are
 * not touched.
 */
export function humanProvenanceChanges(
    previous: FieldProvenanceMap | undefined,
    before: Record<string, any>,
    after: Record<string, any>,
    human: { userId?: string; at: Date }
): FieldProvenanceMap {
    const changes: FieldProvenanceMap = {};
    for (const field of Object.values(TriageField)) {
        if (after[field] === undefined) continue;
        if (sameTriageValue(before[field], after[field])) continue;
        changes[field] = humanProvenance(previous?.[field], human);
    }
    return changes;
}
