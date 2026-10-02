import slugify from "slugify";
import { IMPACT_AREAS, ImpactArea } from "../constants/impact-areas";
import type { TopicData } from "../types/topic.interfaces";
import type {
    TopicInput,
    TopicRef,
} from "../../interfaces/topic.service.interface";

/**
 * Driver-free topic rules shared by the Mongo and Postgres implementations
 * (docs/postgres-migration-foundation.md D2). No mongoose/drizzle imports.
 */

export const DEFAULT_TOPIC_LANGUAGE = "pt";

export function deriveTopicSlug(text: string): string {
    return slugify(text, { lower: true, strict: true });
}

/** Strip accents / diacritical marks (search is accent-insensitive on input). */
export function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Escape regex metacharacters (ReDoS guard for name/alias exact matches). */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function listImpactAreas(): Pick<ImpactArea, "name" | "slug">[] {
    return IMPACT_AREAS.map(({ name, slug }) => ({ name, slug }));
}

/** First alias containing the (normalized, lower-cased) query, else null. */
export function findMatchedAlias(
    aliases: string[] | undefined | null,
    normalizedQueryLower: string
): string | null {
    return (
        aliases?.find((alias) =>
            normalizeText(alias).toLowerCase().includes(normalizedQueryLower)
        ) || null
    );
}

/** The text `create()` slugifies for one input entry: label, then slug, then the bare string. */
export function topicInputSlugSource(topic: any): string {
    return topic?.label || topic?.slug || topic;
}

/** Fields of a brand-new topic built from one `create()` input entry. */
export function buildTopicFromInput(
    topic: TopicInput | any,
    slug: string,
    language: string
): {
    name: any;
    wikidataId?: string;
    aliases: string[];
    slug: string;
    language: string;
} {
    return {
        name: topic?.label || topic,
        wikidataId: topic?.value,
        aliases: topic?.aliases || [],
        slug,
        language,
    };
}

/** Fields of a brand-new topic built from `findOrCreateTopic()` input. */
export function buildTopicFromTopicData(topicData: TopicData): {
    name: string;
    slug: string;
    language: string;
    wikidataId?: string;
} {
    return {
        name: topicData.name,
        slug: deriveTopicSlug(topicData.name),
        language: topicData.language || DEFAULT_TOPIC_LANGUAGE,
        wikidataId: topicData.wikidataId || topicData.value || undefined,
    };
}

/**
 * How `create()` reports an already-existing topic: a wikidata-backed topic
 * becomes `{ id, label, value }`, a plain one collapses to its slug.
 */
export function toExistingTopicRef(topic: {
    _id?: any;
    name: string;
    wikidataId?: string | null;
    slug: string;
}): TopicRef {
    return topic.wikidataId
        ? { id: topic._id, label: topic.name, value: topic.wikidataId }
        : topic.slug;
}
