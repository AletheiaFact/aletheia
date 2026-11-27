import { wikidataId } from "../../../lib/schemas";

/**
 * Names the AI identified in a verification request but could not match to a
 * valid Wikidata item. Personalities are only created from Wikidata, so these
 * wait for a fact-checker to link or dismiss them. Pure functions shared by
 * both backends (docs/postgres-migration-foundation.md, D2).
 */
export interface UnmatchedPersonality {
    name: string;
    /** The Wikidata id the AI suggested, when it failed the creation rule. */
    wikidataCandidate?: string;
}

const key = (name: string) => name.trim().toLocaleLowerCase();

export function addUnmatched(
    current: UnmatchedPersonality[],
    additions: UnmatchedPersonality[]
): UnmatchedPersonality[] {
    const seen = new Set(current.map((u) => key(u.name)));
    const result = [...current];
    for (const addition of additions) {
        if (!seen.has(key(addition.name))) {
            seen.add(key(addition.name));
            result.push(addition);
        }
    }
    return result;
}

export function removeUnmatched(
    current: UnmatchedPersonality[],
    name: string
): { list: UnmatchedPersonality[]; found: boolean } {
    const list = current.filter((u) => key(u.name) !== key(name));
    return { list, found: list.length !== current.length };
}

/** Longest name the dismiss/link endpoint accepts (nonEmptyText(200)). */
const MAX_NAME_LENGTH = 200;

/**
 * Splits the AI's personalities, after Wikidata resolution, into the ones that
 * became personalities and the names that did not. Names are trimmed, blank
 * ones skipped and long ones cut to 200 characters, so the dismiss endpoint
 * can always resolve what is stored.
 */
export function splitResolvedPersonalities<P>(
    resolved: Array<{
        name: string;
        wikidataId?: string | null;
        personality: P | null;
    }>
): { matched: P[]; matchedNames: string[]; unmatched: UnmatchedPersonality[] } {
    const matched: P[] = [];
    const matchedNames: string[] = [];
    const unmatched: UnmatchedPersonality[] = [];
    for (const r of resolved) {
        const name = (r.name ?? "").trim().slice(0, MAX_NAME_LENGTH).trim();
        if (r.personality) {
            matched.push(r.personality);
            if (name) matchedNames.push(name);
        } else if (name) {
            const candidate = wikidataId.safeParse(r.wikidataId).data;
            unmatched.push({
                name,
                ...(candidate && { wikidataCandidate: candidate }),
            });
        }
    }
    return { matched, matchedNames, unmatched };
}

/**
 * New unmatched list after an identification run: a name the AI matched now
 * leaves the list (case-insensitive), then the names it could not match are
 * added. A name a fact-checker dismissed earlier is not remembered, so it
 * returns if the AI names it again.
 */
export function mergeAfterRun(
    existing: UnmatchedPersonality[],
    matchedNames: string[],
    added: UnmatchedPersonality[]
): UnmatchedPersonality[] {
    const matched = new Set(matchedNames.map(key));
    return addUnmatched(
        existing.filter((u) => !matched.has(key(u.name))),
        added
    );
}
