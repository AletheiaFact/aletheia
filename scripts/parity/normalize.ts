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

export type ParityDiff = { path: string; left: unknown; right: unknown };

/** Leaf-level differences between two normalized values. */
export function diffNormalized(
    left: unknown,
    right: unknown,
    path = "$"
): ParityDiff[] {
    if (Array.isArray(left) && Array.isArray(right)) {
        const out: ParityDiff[] = [];
        const length = Math.max(left.length, right.length);
        for (let i = 0; i < length; i++) {
            out.push(...diffNormalized(left[i], right[i], `${path}[${i}]`));
        }
        return out;
    }
    if (
        left &&
        right &&
        typeof left === "object" &&
        typeof right === "object" &&
        !Array.isArray(left) &&
        !Array.isArray(right)
    ) {
        const keys = new Set([
            ...Object.keys(left as object),
            ...Object.keys(right as object),
        ]);
        const out: ParityDiff[] = [];
        for (const key of Array.from(keys).sort()) {
            out.push(
                ...diffNormalized(
                    (left as any)[key],
                    (right as any)[key],
                    `${path}.${key}`
                )
            );
        }
        return out;
    }
    return left === right ? [] : [{ path, left, right }];
}
