import { NameSpaceEnum } from "./Namespace";
import { Review } from "./Review";
import { Topic } from "./Topic";

export type EventOrder = "asc" | "desc";
export type EventStatus = "happening" | "upcoming" | "finalized" | "all";
export interface EventPayload {
    nameSpace: NameSpaceEnum,
    badge: string;
    data_hash?: string;
    name: string;
    slug?: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    mainTopic: Topic;
    filterTopics?: Topic[];
    recaptcha?: string
}

export interface EventMetrics {
    verificationRequests: number,
    claims: number,
    reviews: number,
}
export interface ListEventsOptions {
    page?: number;
    pageSize?: number;
    order?: EventOrder;
    status?: EventStatus;
}

export interface IData {
    events: EventPayload[];
    eventMetrics: EventMetrics;
    total: number;
}

export interface IReviewData {
    items: Review[];
    total: number;
}
