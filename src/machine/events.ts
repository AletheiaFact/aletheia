export type ReviewData = {
    userId: string;
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    sources: string[];
    classification: string;
    sentence_hash: string;
}

export type ClaimReview = {
    personality: string;
    claim: string;
    sentence_hash: string;
    userId: string;
}

export type SaveEvent = {
    type: string;
    reviewData: ReviewData;
    claimReview: ClaimReview;
    t: any;
};

export type ReviewTaskMachineEvents = SaveEvent
