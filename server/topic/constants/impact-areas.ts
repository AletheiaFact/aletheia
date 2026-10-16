import slugify from "slugify";
// Namespace import: server/tsconfig.json has no esModuleInterop
import * as impactAreasData from "./impact-areas.json";

export interface ImpactArea {
    name: string;
    slug: string;
    /**
     * Other names that resolve to this area. Taken from the free-text areas the
     * AI triage produced before the list was closed, so legacy worker output
     * still lands on the right area instead of creating a new topic.
     */
    aliases: string[];
}

export const FALLBACK_IMPACT_AREA_SLUG = "outros";

/**
 * Closed list of impact areas a verification request can have.
 * Draft grouping of the 264 areas produced by the o3 triage (Nov 2025),
 * pending editorial review by the fact-checkers.
 *
 * The slug is the key: each area maps to the Topic with the same slug,
 * created on demand from this list with TopicService.findOrCreateTopic.
 * The data lives in impact-areas.json, so editing the list touches no code.
 */
export const IMPACT_AREAS: ImpactArea[] = impactAreasData.areas;

const toSlug = (text: string) => slugify(text, { lower: true, strict: true });

const IMPACT_AREAS_BY_KEY = new Map<string, ImpactArea>(
    IMPACT_AREAS.flatMap((area) =>
        [area.slug, area.name, ...area.aliases].map(
            (key) => [toSlug(key), area] as [string, ImpactArea]
        )
    )
);

/**
 * Finds the impact area a value refers to, by slug, name or alias.
 * Accepts the shapes that reach the backend: a slug or name string, a
 * Wikidata-style option ({ label, value }) or an AI result ({ name, ... }).
 * @returns the matching area, or undefined when the value is not in the list
 */
export const findImpactArea = (
    value: string | { slug?: string; name?: string; label?: string } | null | undefined
): ImpactArea | undefined => {
    if (!value) {
        return undefined;
    }
    const key =
        typeof value === "string"
            ? value
            : value.slug || value.name || value.label;

    return key ? IMPACT_AREAS_BY_KEY.get(toSlug(key)) : undefined;
};

export const getFallbackImpactArea = (): ImpactArea =>
    IMPACT_AREAS.find((area) => area.slug === FALLBACK_IMPACT_AREA_SLUG)!;
