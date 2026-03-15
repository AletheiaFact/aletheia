import { Event } from "../schema/event.schema";

export interface FindAllResponse {
    events: Event[];
    eventMetrics: Record<string, EventMetricsResponse>;
    total: number;
}

export interface EventMetricsResponse {
    verificationRequests: number,
    claims: number,
    reviews: number,
}
