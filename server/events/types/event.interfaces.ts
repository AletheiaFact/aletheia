import { Event } from "../schema/event.schema";

export interface FindAllResponse {
    events: Event[];
    eventMetrics: Record<string, EventMetricsResponse>;
    total: number;
}

type TopicMetrics = Record<string, number>;

export interface EventMetricsData {
    verificationStats: TopicMetrics,
    claimReviewsStats: TopicMetrics,
    sentencesStats: TopicMetrics,
    imagesStats: TopicMetrics
}

export interface EventMetricsResponse {
    verificationRequests: number,
    claims: number,
    reviews: number,
}
