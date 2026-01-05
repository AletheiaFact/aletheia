/**
 * Personality data enriched with Wikidata information
 */
export interface PersonalityWithWikidata {
    /** Personality database ID */
    personalityId: string;

    /** Personality name */
    name: string;

    /** Personality URL slug */
    slug: string;

    /** Personality description (from database or Wikidata) */
    description: string | null;

    /** Wikidata avatar/image URL, null if not available */
    avatar: string | null;

    /** Wikidata entity ID (e.g., Q22686), null if not linked to Wikidata */
    wikidata: string | null;
}

/**
 * Type guard to check if a personality has a Wikidata ID
 */
export function hasWikidataId(
    personality: PersonalityWithWikidata
): personality is PersonalityWithWikidata & { wikidata: string } {
    return personality.wikidata !== null && personality.wikidata !== "";
}

/**
 * Type guard to check if a personality has an avatar
 */
export function hasAvatar(
    personality: PersonalityWithWikidata
): personality is PersonalityWithWikidata & { avatar: string } {
    return personality.avatar !== null && personality.avatar !== "";
}
