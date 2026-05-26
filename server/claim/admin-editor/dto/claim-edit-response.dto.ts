export interface SentenceViewDto {
    sentenceId: string;
    dataHash: string;
    text: string;
    position: number;
}

export interface ClaimEditableViewDto {
    claimId: string;
    claimSlug: string;
    nameSpace: string;
    personalitySlug?: string;
    baseRevisionId: string;
    metadata: {
        title: string;
        date: string;
        sources: { url: string; description?: string }[];
        personalities: string[];
    };
    sentences: SentenceViewDto[];
}

export interface MetadataChangeEntry {
    field: string;
    from: unknown;
    to: unknown;
}

export interface ClaimEditCommitResponseDto {
    newRevisionId: string;
    newSlug: string;
    historyEntryId: string;
    sentenceHashMap: { oldDataHash: string; newDataHash: string }[];
    cascadeSummary: {
        reviewTasksUpdated: number;
        claimReviewsUpdated: number;
        verificationRequestsUpdated: number;
        commentsUpdated: number;
    };
}
