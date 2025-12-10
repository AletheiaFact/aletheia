/**
 * DTO for personality data enriched with Wikidata information
 */
export interface PersonalityWithWikidataDto {
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
 * Type guard to check if a personality has a valid wikidata ID
 */
export function hasWikidataId(
    personality: PersonalityWithWikidataDto
): personality is PersonalityWithWikidataDto & { wikidata: string } {
    return personality.wikidata !== null && personality.wikidata !== undefined;
}
