export interface AffectedRefSummary {
    reviewTaskCount: number;
    claimReviewCount: number;
    verificationRequestCount: number;
    commentCount: number;
}

export interface SentenceViewDto {
    sentenceId: string;
    dataHash: string;
    text: string;
    position: number;
    affectedRefSummary?: AffectedRefSummary;
}

export interface ClaimEditableViewDto {
    claimId: string;
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

export interface SentenceChangeEntry {
    op: "edit" | "split" | "merge" | "insert" | "delete" | "noop-rehash";
    oldDataHashes: string[];
    newDataHashes: string[];
    affectedRefs: {
        reviewTasks: { id: string; status: string }[];
        claimReviews: { id: string; isPublished: boolean }[];
        verificationRequests: { id: string; status: string }[];
        comments: number;
    };
}

export interface AmbiguityEntry {
    sentenceChangeIndex: number;
    op: "split" | "merge";
    affectedRefs: SentenceChangeEntry["affectedRefs"];
    choices: Record<string, unknown>;
}

export interface ClaimEditPreviewResponseDto {
    status: "ready" | "needs-resolution";
    classifiedDiff: {
        metadataChanges: MetadataChangeEntry[];
        sentenceChanges: SentenceChangeEntry[];
    };
    ambiguities: AmbiguityEntry[];
}

export interface ClaimEditCommitResponseDto {
    newRevisionId: string;
    historyEntryId: string;
    sentenceHashMap: { oldDataHash: string; newDataHash: string }[];
    cascadeSummary: {
        reviewTasksUpdated: number;
        reviewTasksArchived: number;
        reviewTasksDuplicated: number;
        claimReviewsUpdated: number;
        claimReviewsArchived: number;
        verificationRequestsUpdated: number;
        verificationRequestsArchived: number;
        commentsUpdated: number;
        afcJobsCancelled: number;
        afcJobsReenqueued: number;
    };
}
