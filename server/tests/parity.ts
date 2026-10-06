import { expect } from "vitest";

const OBJECT_ID_RE = /^[0-9a-f]{24}$/i;
const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

// Backend-only bookkeeping that never reaches an API consumer.
const DROPPED_KEYS = new Set([
    "__v",
    "legacyObjectId",
    "legacy_object_id",
    "isDeleted",
    "deletedAt",
]);

export type ParityOptions = {
    dropKeys?: string[];
};

const isIdLike = (value: unknown): value is string =>
    typeof value === "string" &&
    (OBJECT_ID_RE.test(value) || UUID_RE.test(value));

const isEmpty = (value: unknown) =>
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
        value !== null &&
        !(value instanceof Date) &&
        Object.keys(value as object).length === 0);

/**
 * Shape-level normalization for Mongo↔Postgres comparisons: ids become
 * `<id:n>` by order of appearance, timestamps become `<date>`, driver
 * bookkeeping keys are dropped, keys are sorted, and empty/absent values
 * collapse (Mongo omits unset fields where Postgres stores [] / {} / null).
 */
export function normalizeForParity(
    value: unknown,
    options: ParityOptions = {},
    ids: Map<string, string> = new Map()
): unknown {
    const drop = new Set([...DROPPED_KEYS, ...(options.dropKeys ?? [])]);
    const idToken = (id: string) => {
        if (!ids.has(id)) ids.set(id, `<id:${ids.size + 1}>`);
        return ids.get(id);
    };
    const walk = (v: any): unknown => {
        if (v === undefined || v === null) return undefined;
        if (v instanceof Date) return "<date>";
        if (v instanceof Map) return walk(Object.fromEntries(v));
        if (typeof v === "object" && typeof v.toHexString === "function") {
            return idToken(v.toHexString());
        }
        if (typeof v === "string") {
            if (isIdLike(v)) return idToken(v);
            if (ISO_DATE_RE.test(v)) return "<date>";
            return v;
        }
        if (Array.isArray(v)) return v.map(walk);
        if (typeof v === "object") {
            const plain =
                typeof v.toObject === "function"
                    ? v.toObject({ virtuals: false })
                    : v;
            const out: Record<string, unknown> = {};
            for (const key of Object.keys(plain).sort()) {
                if (drop.has(key)) continue;
                const walked = walk(plain[key]);
                if (isEmpty(walked)) continue;
                out[key] = walked;
            }
            return out;
        }
        return v;
    };
    return walk(value);
}

/**
 * Collects the same operation's result from each backend and asserts the
 * normalized shapes match once both are present (the contract suites run
 * backends in separate describe blocks, so the comparison is deferred).
 */
export class ParityRecorder {
    private readonly results = new Map<string, Map<string, unknown>>();

    constructor(private readonly options: ParityOptions = {}) {}

    record(key: string, backend: string, value: unknown) {
        if (!this.results.has(key)) this.results.set(key, new Map());
        this.results
            .get(key)!
            .set(backend, normalizeForParity(value, this.options));
    }

    /** Keys that were recorded by fewer than two backends. */
    incomplete(): string[] {
        return Array.from(this.results.entries())
            .filter(([, byBackend]) => byBackend.size < 2)
            .map(([key]) => key);
    }

    assertAll() {
        for (const [key, byBackend] of this.results) {
            const entries = Array.from(byBackend.entries());
            if (entries.length < 2) continue;
            const [[firstName, first], ...rest] = entries;
            for (const [name, value] of rest) {
                expect(
                    value,
                    `parity(${key}): ${name} vs ${firstName}`
                ).toEqual(first);
            }
        }
    }
}
