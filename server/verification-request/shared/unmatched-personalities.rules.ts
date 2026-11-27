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
