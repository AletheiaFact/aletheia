import { Sentence } from "../schemas/sentence.schema";

export interface Review {
    personality: string;
    usersId: string;
    isPartialReview: boolean;
}

export type TopicRelatedSentencesResponse = Sentence & {
    classification?: string;
    review?: Review;
}
