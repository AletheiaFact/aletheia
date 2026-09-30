import validator from "validator";
const md5 = require("md5");

/**
 * Shared source business rules (docs/postgres-migration-foundation.md D2).
 * Pure functions only — no mongoose/drizzle/pg/schema imports. Both backend
 * implementations consume these; no rule may exist in two places.
 */

/** A source href must be an absolute URL including its protocol. */
export function isValidSourceHref(href: unknown): boolean {
    return (
        typeof href === "string" &&
        !!href &&
        validator.isURL(href, { require_protocol: true })
    );
}

/**
 * Deduplication key for a source: md5 of the href. Unique per source
 * (`data_hash` unique index on both backends).
 */
export function deriveDataHash(href: string): string {
    return md5(href);
}
