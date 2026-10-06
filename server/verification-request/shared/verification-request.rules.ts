import * as crypto from "crypto";
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

export function validateAiTaskResult(
    field: string,
    result: any,
    isValidId: (id: any) => boolean
): { valid: boolean; error?: string } {
    switch (field) {
        case "embedding":
            if (!Array.isArray(result) || result.length === 0) {
                return {
                    valid: false,
                    error: "Embedding must be a non-empty array",
                };
            }
            if (result.some((v: any) => typeof v !== "number")) {
                return {
                    valid: false,
                    error: "Embedding must contain only numbers",
                };
            }
            break;
        case "topics":
            if (!Array.isArray(result) || result.length === 0) {
                return {
                    valid: false,
                    error: "Topics must be a non-empty array",
                };
            }
            if (!result.every((id: any) => isValidId(id))) {
                return {
                    valid: false,
                    error: "All topics must be valid ObjectIds",
                };
            }
            break;
        case "identifiedData":
            if (
                result === null ||
                result === undefined ||
                (Array.isArray(result) && result.length === 0)
            ) {
                return { valid: true };
            }
            if (Array.isArray(result)) {
                if (result.every((id: any) => isValidId(id))) {
                    return { valid: true };
                }
                return {
                    valid: false,
                    error: "All identifiedData must be valid ObjectIds",
                };
            }
            return {
                valid: false,
                error: `Identified data must be an array of ObjectIds, got: ${typeof result}`,
            };
        case "impactArea":
            if (!result) {
                return { valid: false, error: "Impact area is required" };
            }
            break;
        case "severity":
            if (
                !Object.values(SeverityEnum)
                    .map(String)
                    .includes(String(result))
            ) {
                return {
                    valid: false,
                    error: `Invalid severity value: ${result}`,
                };
            }
            break;
    }
    return { valid: true };
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
