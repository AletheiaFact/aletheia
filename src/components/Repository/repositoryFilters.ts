import {
    MethodologyId,
    isMethodologyId,
} from "../../../lib/classification-methodology";
import { isClassificationKey } from "../../../lib/classification";
import { ContentModelEnum } from "../../types/enums";

export type RepositoryTab = "claims" | "reviews";
export type ReviewStatus = "all" | "with" | "without";

export interface NamedOption {
    id: string;
    name: string;
}

export interface RepositoryFilters {
    q: string;
    personality: NamedOption | null;
    topic: NamedOption | null;
    contentModel: string[];
    startDate: Date | null;
    endDate: Date | null;
    order: "desc" | "asc";
    // Claims tab only
    reviewStatus: ReviewStatus;
    // Reviews tab only
    methodology: MethodologyId | null;
    classification: string[];
}

// Display order of the content type filter
export const CONTENT_MODELS = [
    ContentModelEnum.Speech,
    ContentModelEnum.Unattributed,
    ContentModelEnum.Debate,
    ContentModelEnum.Image,
];

export const EMPTY_FILTERS: RepositoryFilters = {
    q: "",
    personality: null,
    topic: null,
    contentModel: [],
    startDate: null,
    endDate: null,
    order: "desc",
    reviewStatus: "all",
    methodology: null,
    classification: [],
};

export const hasActiveFilters = (filters: RepositoryFilters) =>
    Object.keys(EMPTY_FILTERS).some(
        (key) =>
            key !== "order" &&
            JSON.stringify(filters[key]) !== JSON.stringify(EMPTY_FILTERS[key])
    );

type QueryValue = string | string[] | undefined;
export type RepositoryQuery = Record<string, QueryValue>;

const first = (value: QueryValue) =>
    Array.isArray(value) ? value[0] : value;
const all = (value: QueryValue) =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];

// Dates travel as local yyyy-mm-dd so a shared link means the same days.
const toDay = (date: Date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

const fromDay = (value?: string) => {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? new Date(+match[1], +match[2] - 1, +match[3]) : null;
};

const namedOption = (id?: string, name?: string): NamedOption | null =>
    id ? { id, name: name || id } : null;

export const parseTab = (query: RepositoryQuery): RepositoryTab =>
    first(query.tab) === "reviews" ? "reviews" : "claims";

export const parseFilters = (query: RepositoryQuery): RepositoryFilters => {
    const reviewStatus = first(query.reviewStatus);
    const methodology = first(query.methodology);
    return {
        q: first(query.q) || "",
        personality: namedOption(
            first(query.personality),
            first(query.personalityName)
        ),
        topic: namedOption(first(query.topic), first(query.topicName)),
        contentModel: all(query.contentModel).filter((value) =>
            CONTENT_MODELS.includes(value as ContentModelEnum)
        ),
        startDate: fromDay(first(query.startDate)),
        endDate: fromDay(first(query.endDate)),
        order: first(query.order) === "asc" ? "asc" : "desc",
        reviewStatus:
            reviewStatus === "with" || reviewStatus === "without"
                ? reviewStatus
                : "all",
        methodology: isMethodologyId(methodology) ? methodology : null,
        classification: all(query.classification).filter(isClassificationKey),
    };
};

export const toSearchParams = (
    tab: RepositoryTab,
    filters: RepositoryFilters
): URLSearchParams => {
    const params = new URLSearchParams();
    const set = (key: string, value?: string | null) =>
        value && params.set(key, value);

    if (tab === "reviews") {
        params.set("tab", tab);
    }
    set("q", filters.q.trim());
    set("personality", filters.personality?.id);
    set("personalityName", filters.personality?.name);
    set("topic", filters.topic?.id);
    set("topicName", filters.topic?.name);
    filters.contentModel.forEach((value) => params.append("contentModel", value));
    set("startDate", filters.startDate && toDay(filters.startDate));
    set("endDate", filters.endDate && toDay(filters.endDate));
    set("order", filters.order === "asc" ? "asc" : null);
    if (tab === "claims") {
        set("reviewStatus", filters.reviewStatus !== "all" && filters.reviewStatus);
    } else {
        set("methodology", filters.methodology);
        filters.classification.forEach((value) =>
            params.append("classification", value)
        );
    }
    return params;
};

const startOfDay = (date: Date | null) => {
    if (!date) return undefined;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start.toISOString();
};

const endOfDay = (date: Date | null) => {
    if (!date) return undefined;
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end.toISOString();
};

const sharedParams = (filters: RepositoryFilters) => ({
    q: filters.q.trim() || undefined,
    contentModel: filters.contentModel.length
        ? filters.contentModel
        : undefined,
    startDate: startOfDay(filters.startDate),
    endDate: endOfDay(filters.endDate),
    order: filters.order,
});

export const toClaimParams = (filters: RepositoryFilters) => ({
    ...sharedParams(filters),
    personality: filters.personality?.id,
    topic: filters.topic?.id,
    reviewStatus:
        filters.reviewStatus === "all" ? undefined : filters.reviewStatus,
    // Sending sortBy also switches the API to the filtered listing,
    // which returns the content type counts.
    sortBy: "date" as const,
});

export const toReviewParams = (filters: RepositoryFilters) => ({
    ...sharedParams(filters),
    personality: filters.personality?.id,
    mainTopicId: filters.topic?.id,
    classificationMethodology: filters.methodology ?? undefined,
    classification: filters.classification.length
        ? filters.classification
        : undefined,
    withCounts: true,
});
