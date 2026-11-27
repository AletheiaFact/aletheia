import {
    BadRequestException,
    ConflictException,
    HttpException,
    ServiceUnavailableException,
} from "@nestjs/common";
import slugify from "slugify";
import { DuplicateKeyError } from "../../database/errors";
import { wikidataId as wikidataIdSchema } from "../../../lib/schemas";

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
 * Default description used when creating a personality (admin create and AI
 * findOrCreate) from a Wikidata item that provides none:
 * `Personality: <name>`.
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
    | "no_label"
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
        case "no_label":
            return new BadRequestException({
                message:
                    "The Wikidata item has no name in Portuguese or English",
                reason: "no_label",
            });
        case "in_use":
            return new ConflictException({
                message: "Another personality already uses this Wikidata item",
                reason: "in_use",
            });
    }
}

/** 503 thrown when Wikidata cannot be reached: never create unchecked. */
export function wikidataUnavailableError(): ServiceUnavailableException {
    return new ServiceUnavailableException(
        "Wikidata is unavailable, try again later"
    );
}

/**
 * Failures the AI path (findOrCreatePersonality and the backfill probe)
 * treats as "do not create": HTTP errors from the creation rules (400, 409,
 * 503), a backend duplicate-key error, and a raw Mongo E11000 (the Mongo
 * service does not map it). Anything else is a bug or an outage and must
 * propagate.
 */
export function isExpectedCreationFailure(error: unknown): boolean {
    return (
        error instanceof HttpException ||
        error instanceof DuplicateKeyError ||
        (typeof error === "object" &&
            error !== null &&
            (error as { code?: unknown }).code === 11000)
    );
}

type EditableFields = {
    name?: string | null;
    description?: string | null;
    wikidata?: string | null;
};

/**
 * The editable fields (name, description, wikidata) whose body value is
 * defined and differs from the stored one.
 */
export function diffEditableFields(
    stored: EditableFields,
    body: { name?: string; description?: string; wikidata?: string }
): Partial<{ name: string; description: string; wikidata: string }> {
    const changes: Partial<{
        name: string;
        description: string;
        wikidata: string;
    }> = {};
    for (const key of ["name", "description", "wikidata"] as const) {
        if (body[key] !== undefined && body[key] !== stored[key]) {
            changes[key] = body[key];
        }
    }
    return changes;
}

export type StoredWikidataStatus =
    | "ok"
    | "deleted"
    | "not_allowed_type"
    | "unavailable"
    | "none";

export type StoredPersonalityView = {
    _id: string;
    name: string;
    description: string;
    wikidata: string | null;
    wikidataStatus: StoredWikidataStatus;
    wikidataProvides: { name: boolean; description: boolean };
};

/**
 * What the admin edit form needs: the stored fields plus the Wikidata state.
 * `check` is the Wikidata check result, "unavailable" when the check threw,
 * or null when the personality has no Wikidata item.
 */
export function storedPersonalityView(
    stored: {
        id: string;
        name: string;
        description: string;
        wikidata: string | null;
    },
    check:
        | {
              status: "ok" | "deleted" | "not_allowed_type";
              props: { name?: string; description?: string };
          }
        | "unavailable"
        | null
): StoredPersonalityView {
    const wikidataStatus: StoredWikidataStatus =
        check === null
            ? "none"
            : check === "unavailable"
            ? "unavailable"
            : check.status;
    const provides =
        check !== null && check !== "unavailable" && check.status === "ok";
    return {
        _id: stored.id,
        name: stored.name,
        description: stored.description,
        wikidata: stored.wikidata ?? null,
        wikidataStatus,
        wikidataProvides: {
            name: provides && !!check.props.name,
            description: provides && !!check.props.description,
        },
    };
}

/**
 * The Wikidata id the AI gave, or null when it is missing or malformed. A
 * malformed id is treated as no id so it never reaches Wikidata or a write.
 */
export function usableAiWikidataId(id: unknown): string | null {
    const parsed = wikidataIdSchema.safeParse(id);
    return parsed.success ? parsed.data : null;
}
