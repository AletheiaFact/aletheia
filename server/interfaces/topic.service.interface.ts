import { ITopic } from "./topic.interface";
import type { TopicData } from "../topic/types/topic.interfaces";
import type { ImpactArea } from "../topic/constants/impact-areas";

/**
 * One entry of `create({ topics })`: a wikidata pick (`{ label, value }`), a
 * bare name, or a `{ slug }` reference to an existing topic.
 */
export type TopicInput =
    | string
    | { label?: string; value?: string; aliases?: string[]; slug?: string };

export type TopicCreateInput = {
    /** ContentModelEnum for claim content; the UI also forwards other target kinds. */
    contentModel?: string | null;
    topics: TopicInput[];
    data_hash?: string;
};

/** What `create()` hands back per topic (and forwards to sentence/image). */
export type TopicRef = { id: any; label: string; value?: string } | string;

export type ITopicService = {
    getWikidataEntities(regex: string, language: string): Promise<any>;
    searchTopics(
        query: string,
        language?: string,
        limit?: number
    ): Promise<any>;
    findAll(getTopics: { topicName: string }, language?: string): Promise<any>;
    create(body: TopicCreateInput, language?: string): Promise<any>;
    getBySlug(slug: string): Promise<ITopic | null>;
    getImpactAreas(): Pick<ImpactArea, "name" | "slug">[];
    findByNames(names: string[]): Promise<ITopic[]>;
    findByWikidataIds(wikidataIds: string[]): Promise<ITopic[]>;
    findOrCreateTopic(topicData: TopicData): Promise<ITopic>;
};
