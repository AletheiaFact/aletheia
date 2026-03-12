import { NameSpaceEnum } from "./Namespace";
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
export interface ListEventsOptions {
    page?: number;
    pageSize?: number;
    order?: EventOrder;
    status?: EventStatus;
}

export interface IDynamicEventForm {
    data?: EventPayload;
    onSubmit: (value: EventPayload) => void;
    isLoading: boolean;
    setRecaptchaString: React.Dispatch<React.SetStateAction<string>>;
    hasCaptcha: boolean;
    isDrawerOpen?: boolean;
    onClose?: () => void;
}
