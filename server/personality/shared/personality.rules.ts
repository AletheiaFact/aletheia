import slugify from "slugify";

/**
 * Backend-agnostic personality business rules, shared by the Mongo and
 * Postgres service implementations (see docs/postgres-migration-foundation.md,
 * Decision D2). Pure functions only: no `this`, no DI, and no imports from
 * mongoose, drizzle-orm, pg, or any schema file. If the same rule appears in
 * both backend implementations, it belongs here instead.
 */

/**
 * Canonical slug derivation. The slug is ALWAYS derived from the name — a
 * caller-supplied slug is never honored (both backends overwrite it).
 */
export function deriveSlug(name: string): string {
    return slugify(name, {
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
    });
}

/**
 * Default description used by findOrCreatePersonality when Wikidata provides
 * none: `Personality: <name>`.
 */
export function defaultDescription(
    name: string,
    wikidataDescription?: string | null
): string {
    return wikidataDescription || `Personality: ${name}`;
}
