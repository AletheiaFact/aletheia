export type ReviewData = {
    usersId: string;
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    sources: string[];
    classification: string;
};

export type ClaimReview = {
    personality: string;
    claim: string;
    usersId: string;
};

export type SaveEvent = {
    type: string;
    reviewData: ReviewData;
    claimReview: ClaimReview;
};

export type ReviewTaskMachineEvents = SaveEvent;
