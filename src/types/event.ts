import { Dispatch, SetStateAction } from "react";
import { ViewMode } from "../components/FilterToggleButtons";
import { NameSpaceEnum } from "./Namespace";
import { Review } from "./Review";
import { Topic } from "./Topic";
import { VerificationRequest } from "./VerificationRequest";
import { NextRouter } from "next/router";

export type EventOrder = "asc" | "desc";
export type EventStatus = "happening" | "upcoming" | "finalized" | "all";
export interface EventPayload {
    id?: string;
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

export interface IVerificationRequestData {
    items: VerificationRequest[];
    total: number;
    totalPages: number
}

export interface EventsState {
    nameSpace: NameSpaceEnum;
    isLoading: boolean;
    hasCaptcha: boolean;
    recaptchaString: string;
    eventHref: string;
    eventsData: IData;
    error: string | null;
    eventsQuery: ListEventsOptions;
    reviewData: IReviewData;
    reviewQuery: ListEventsOptions;
    viewMode: ViewMode;
    verificationRequestData: IVerificationRequestData;
    verificationRequestQuery: ListEventsOptions;
}

export interface EventsActions {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setRecaptchaString: Dispatch<SetStateAction<string>>;
    t: (key: string) => string;
    router: NextRouter;
    setEventsData: Dispatch<SetStateAction<IData>>;
    setError: Dispatch<SetStateAction<string | null>>;
    setEventsQuery: Dispatch<SetStateAction<ListEventsOptions>>;
    setReviewData: Dispatch<SetStateAction<IReviewData>>;
    setReviewQuery: Dispatch<SetStateAction<ListEventsOptions>>;
    setViewMode: Dispatch<SetStateAction<ViewMode>>;
    setVerificationRequestData: Dispatch<SetStateAction<IVerificationRequestData>>;
    setVerificationRequestQuery: Dispatch<SetStateAction<ListEventsOptions>>;
}
