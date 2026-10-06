import * as crypto from "node:crypto";
import { EXPECTED_STATES, SeverityEnum } from "../dto/types";

const md5 = require("md5");

export const EXPECTED_STATE_ORDER: readonly string[] = EXPECTED_STATES;

export const STATE_TO_EVENT: Record<string, string> = {
    embedding: "embed",
    identifiedData: "identifyData",
    topics: "defineTopics",
    impactArea: "defineImpactArea",
    severity: "defineSeverity",
};

export function computeDataHash(content: string): string {
    return md5(content);
}

export function filterValidSources<T extends { href?: string }>(
    source: T[] | undefined | null
): T[] {
    return source?.filter((s) => s?.href?.trim()) || [];
}

export function findRemovedIds(
    initial: { content: any[] },
    updated: { content: string[] }
): string[] {
    return initial.content.filter(
        (id) => !updated.content.includes(id.toString())
    );
}

export function hashResult(result: any): string {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(result))
        .digest("hex");
}

type Validation = { valid: boolean; error?: string };
type IdPredicate = (id: any) => boolean;

const ok: Validation = { valid: true };
const fail = (error: string): Validation => ({ valid: false, error });

const validateEmbedding = (result: any): Validation => {
    if (!Array.isArray(result) || result.length === 0) {
        return fail("Embedding must be a non-empty array");
    }
    if (result.some((v: any) => typeof v !== "number")) {
        return fail("Embedding must contain only numbers");
    }
    return ok;
};

const validateTopics = (result: any, isValidId: IdPredicate): Validation => {
    if (!Array.isArray(result) || result.length === 0) {
        return fail("Topics must be a non-empty array");
    }
    if (!result.every(isValidId)) {
        return fail("All topics must be valid ObjectIds");
    }
    return ok;
};

const validateIdentifiedData = (
    result: any,
    isValidId: IdPredicate
): Validation => {
    if (result === null || result === undefined) return ok;
    if (!Array.isArray(result)) {
        return fail(
            `Identified data must be an array of ObjectIds, got: ${typeof result}`
        );
    }
    if (result.length === 0 || result.every(isValidId)) {
        return ok;
    }
    return fail("All identifiedData must be valid ObjectIds");
};

const validateSeverity = (result: any): Validation =>
    Object.values(SeverityEnum).map(String).includes(String(result))
        ? ok
        : fail(`Invalid severity value: ${result}`);

export function validateAiTaskResult(
    field: string,
    result: any,
    isValidId: IdPredicate
): Validation {
    switch (field) {
        case "embedding":
            return validateEmbedding(result);
        case "topics":
            return validateTopics(result, isValidId);
        case "identifiedData":
            return validateIdentifiedData(result, isValidId);
        case "impactArea":
            return result ? ok : fail("Impact area is required");
        case "severity":
            return validateSeverity(result);
        default:
            return ok;
    }
}

export function topicWikidataKey(
    topic: { value?: string; wikidataId?: string } | string
): string {
    const pick =
        typeof topic === "string" ? undefined : topic.value || topic.wikidataId;
    return pick!;
}

export function extractSeverity(result: any): string | undefined {
    if (typeof result === "string") return result;
    if (result?.severity) return result.severity;
    return undefined;
}

export function nextMissingState(
    statesExecuted: string[],
    isPending: (state: string) => boolean
): string | undefined {
    if (statesExecuted.includes("severity")) return undefined;
    return EXPECTED_STATE_ORDER.find(
        (state) => !statesExecuted.includes(state) && !isPending(state)
    );
}

export function runnableMissingStates(statesExecuted: string[]): string[] {
    if (statesExecuted.includes("severity")) return [];
    return EXPECTED_STATE_ORDER.filter((state) => {
        if (statesExecuted.includes(state)) return false;
        if (
            (state === "topics" || state === "impactArea") &&
            !statesExecuted.includes("identifiedData")
        ) {
            return false;
        }
        if (
            state === "severity" &&
            (!statesExecuted.includes("topics") ||
                !statesExecuted.includes("impactArea"))
        ) {
            return false;
        }
        return true;
    });
}

export function calculateAverageDuration(transitions: any[]): number {
    if (!transitions || transitions.length === 0) return 0;
    const total = transitions.reduce(
        (sum: number, t: { duration?: number }) => sum + (t.duration || 0),
        0
    );
    return total / transitions.length;
}

export function buildProgress(
    statesExecuted: string[],
    transitions: any[],
    now: number = Date.now()
) {
    const totalStates = EXPECTED_STATE_ORDER.length;
    const completed = statesExecuted.length;
    const avgDuration = calculateAverageDuration(transitions);
    const remainingStates = totalStates - completed;
    return {
        current: statesExecuted[statesExecuted.length - 1] || "starting",
        completed,
        total: totalStates,
        percentage: (completed / totalStates) * 100,
        estimatedCompletion:
            avgDuration > 0
                ? new Date(now + avgDuration * remainingStates)
                : undefined,
    };
}

export function stalePendingTaskFields(
    pendingFields: string[],
    statesExecuted: string[],
    lastUpdate: Date | string | undefined,
    timeoutMs: number,
    now: number = Date.now()
): string[] {
    const age = now - new Date(lastUpdate ?? now).getTime();
    return pendingFields.filter(
        (field) => statesExecuted.includes(field) || age > timeoutMs
    );
}
