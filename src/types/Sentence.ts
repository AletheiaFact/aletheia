import { SentenceTopic } from "./SentenceTopic";

export interface SentenceContent {
    _id: string;
    content: string;
    classification: string;
    claimRevisionId: string,
    type: string;
    data_hash: string;
    props: any;
    topics: SentenceTopic[];
}

export interface Sentence {
    _id: string;
    content: SentenceContent;
    data_hash: string;
    topics: SentenceTopic[] | string[];
}
