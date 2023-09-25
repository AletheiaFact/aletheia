import { RemirrorJSON } from "remirror";

export enum ClassificationEnum {
    "not-fact" = 0,
    "false",
    "misleading",
    "unsustainable",
    "unverifiable",
    "exaggerated",
    "arguable",
    "trustworthy-but",
    "trustworthy",
}

export type ReviewData = {
    usersId: string[];
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    sources: string[] | object[];
    classification: string | ClassificationEnum;
    rejectionComment: string;
    reviewerId: string;
    editor: RemirrorJSON;
};

export type ClaimReview = {
    personality: string;
    claim: string;
    usersId: string;
    isPartialReview: boolean;
};

export type SaveEvent = {
    type: string;
    reviewData: ReviewData;
    claimReview: ClaimReview;
};

export type ReviewTaskMachineEvents = SaveEvent;
