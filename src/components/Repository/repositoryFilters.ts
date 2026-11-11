import {
    DEFAULT_METHODOLOGY,
    MethodologyId,
    isMethodologyId,
} from "../../../lib/classification-methodology";
import { isClassificationKey } from "../../../lib/classification";
import { ContentModelEnum } from "../../types/enums";

export type RepositoryTab = "claims" | "reviews";
export type ReviewStatus = "all" | "with" | "without";
export type SortOrder = "desc" | "asc";

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
    order: SortOrder;
    // Claims tab only
    reviewStatus: ReviewStatus;
    // Reviews tab only. The methodology only picks the wording of the
    // classification options; it does not filter the results, since every
    // methodology stores the same classification keys.
    methodology: MethodologyId;
    classification: string[];
}

export type FiltersChangeHandler = (
    changes: Partial<RepositoryFilters>
) => void;

// Adds the value to a multi-select filter, or removes it if already there
export const toggleValue = (list: string[], value: string) =>
    list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

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
    methodology: DEFAULT_METHODOLOGY,
    classification: [],
};

// View preferences, kept by "clear filters" and not counted as filters
const VIEW_KEYS = new Set(["order", "methodology"]);

export const hasActiveFilters = (filters: RepositoryFilters) =>
    Object.keys(EMPTY_FILTERS).some(
        (key) =>
            !VIEW_KEYS.has(key) &&
            JSON.stringify(filters[key]) !== JSON.stringify(EMPTY_FILTERS[key])
    );

export const clearedFilters = (filters: RepositoryFilters): RepositoryFilters => ({
    ...EMPTY_FILTERS,
    order: filters.order,
    methodology: filters.methodology,
});

type QueryValue = string | string[] | undefined;
export type RepositoryQuery = Record<string, QueryValue>;

const first = (value: QueryValue) =>
    Array.isArray(value) ? value[0] : value;
const all = (value: QueryValue): string[] => {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
};

// Dates travel as local yyyy-mm-dd so a shared link means the same days.
const toDay = (date: Date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

const fromDay = (value?: string) => {
    const match = value && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return match ? new Date(+match[1], +match[2] - 1, +match[3]) : null;
};

const namedOption = (id?: string, name?: string): NamedOption | null =>
    id ? { id, name: name || id } : null;

// Fact-checks are the default tab; claims need an explicit ?tab=claims
export const parseTab = (query: RepositoryQuery): RepositoryTab =>
    first(query.tab) === "claims" ? "claims" : "reviews";

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
        methodology: isMethodologyId(methodology)
            ? methodology
            : DEFAULT_METHODOLOGY,
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

    if (tab === "claims") {
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
        set(
            "methodology",
            filters.methodology !== DEFAULT_METHODOLOGY && filters.methodology
        );
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
    classification: filters.classification.length
        ? filters.classification
        : undefined,
    withCounts: true,
});
