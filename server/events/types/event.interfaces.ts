import { Types } from "mongoose";
import { Event, EventDocument } from "../schema/event.schema";
export interface TopicCountAggregation {
    _id: Types.ObjectId;
    count: number;
}

export interface TopicDataAggregation {
    _id: Types.ObjectId;
    hashes: string[];
    claimRevisionIds: Types.ObjectId[];
}

export interface BuildMetricsParams {
    events: EventDocument[];
    verificationStats: TopicCountAggregation[];
    claimReviewsStats: Record<string, number>;
    sentencesData: TopicDataAggregation[];
    imagesData: TopicDataAggregation[];
}
export interface EventMetricsResponse {
    verificationRequests: number,
    claims: number,
    reviews: number,
}

export type EventMetricsData = Record<string, EventMetricsResponse>;
export interface FindAllResponse {
    events: Event[];
    eventMetrics: EventMetricsData;
    total: number;
}
