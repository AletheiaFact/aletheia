import { ProsemirrorNode } from "remirror";

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
    reviewerId: string;
    visualEditor?: ProsemirrorNode;
    reviewDataHtml?: any;
    crossCheckingComments: any[];
    crossCheckingComment: string;
    crossCheckingClassification: string;
};

export type ClaimReview = {
    personality: string;
    claim: string;
    usersId: string;
    source: string;
    isPartialReview: boolean;
};

export type SaveEvent = {
    type: string;
    reviewData: ReviewData;
    claimReview: ClaimReview;
};

export type ReviewTaskMachineEvents = SaveEvent;
