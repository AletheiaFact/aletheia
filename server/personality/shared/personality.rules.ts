import {
    BadRequestException,
    ConflictException,
    HttpException,
} from "@nestjs/common";
import slugify from "slugify";

/**
 * Backend-agnostic personality business rules, shared by the Mongo and
 * Postgres service implementations (see docs/postgres-migration-foundation.md,
 * Decision D2). Pure functions only: no `this`, no DI, and no imports from
 * mongoose, drizzle-orm, pg, or any schema file. If the same rule appears in
 * both backend implementations, it belongs here instead. HTTP exception types
 * from @nestjs/common are allowed, so both backends throw the same error
 * envelope.
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

/** Claims carry their parsed content; listings only need its text. */
export function extractClaimWithTextSummary(claims: any) {
    const list = Array.isArray(claims) ? claims : [claims];
    return list.map((claim: any) => {
        if (!claim.content) {
            return claim;
        }
        return { ...claim, content: claim.content.text };
    });
}

/**
 * Why a Wikidata item cannot back a new personality (or a relink):
 * `ok` means it can.
 */
export type WikidataCreationStatus =
    | "ok"
    | "deleted"
    | "not_allowed_type"
    | "in_use";

/**
 * Maps a creation status to the HTTP error both backends throw. Personalities
 * are only ever created from an existing Wikidata item of an allowed type
 * (human, public company, online newspaper, government) that no other active
 * personality uses.
 */
export function wikidataCreationError(
    status: WikidataCreationStatus
): HttpException | undefined {
    switch (status) {
        case "ok":
            return undefined;
        case "deleted":
            return new BadRequestException({
                message: "The Wikidata item was deleted",
                reason: "deleted",
            });
        case "not_allowed_type":
            return new BadRequestException({
                message:
                    "The Wikidata item is not a person, company, newspaper or government",
                reason: "not_allowed_type",
            });
        case "in_use":
            return new ConflictException({
                message: "Another personality already uses this Wikidata item",
                reason: "in_use",
            });
    }
}
