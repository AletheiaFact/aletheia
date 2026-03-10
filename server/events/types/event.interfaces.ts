import { TopicRelatedSentencesResponse } from "../../claim/types/sentence/types/sentence.interfaces";
import { VerificationRequest } from "../../verification-request/schemas/verification-request.schema";
import { Event } from "../schema/event.schema";

export type FullEventResponse = Event & {
    sentences: TopicRelatedSentencesResponse[];
    verificationRequests: VerificationRequest[];
};

export interface FindAllResponse {
    events: Event[];
    total: number;
}
