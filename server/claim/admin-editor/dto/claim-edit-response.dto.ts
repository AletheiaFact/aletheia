export interface PersonalityRefDto {
    _id: string;
    name: string;
    slug?: string;
}

export interface SentenceViewDto {
    sentenceId: string;
    dataHash: string;
    text: string;
    position: number;
    // Set when the sentence has a review: a published one blocks deletion,
    // an in-progress one makes the editor ask before deleting.
    reviewStatus?: "in-progress" | "published";
    // Set for debates: the speech (turn) the sentence belongs to.
    speechId?: string;
    personalityId?: string;
}

export interface ClaimEditableViewDto {
    claimId: string;
    claimSlug: string;
    nameSpace: string;
    personalitySlug?: string;
    baseRevisionId: string;
    contentModel: string;
    metadata: {
        title: string;
        date: string;
        sources: { url: string; description?: string }[];
        personalities: PersonalityRefDto[];
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
        reportsUpdated: number;
        verificationRequestsUpdated: number;
        commentsUpdated: number;
    };
}
