import type { ISentence } from "./claim-content.interface";

export type SentenceFindAllOptions = {
    searchText: string;
    pageSize: number;
    language?: string;
    skippedDocuments?: number;
    filter?: string | string[];
    nameSpace?: string;
};

export type ISentenceService = {
    create(sentenceBody: Record<string, any>): Promise<any>;
    getByDataHash(data_hash: string): Promise<ISentence>;
    updateSentenceWithTopics(
        topics: any[],
        data_hash: string
    ): Promise<ISentence | null>;
    findAll(
        options: SentenceFindAllOptions
    ): Promise<{ totalRows: number; processedSentences: any[] }>;
    getHashesByTopic(topicId: string): Promise<string[]>;
};
