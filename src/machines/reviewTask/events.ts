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

type FactCheckingReviewData = {
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

type InformativeNewsReviewData = {
    usersId: string[];
    summary: string;
    sources: string[] | object[];
    classification: string | ClassificationEnum;
    visualEditor?: ProsemirrorNode;
    reviewDataHtml?: any;
};

type RequestReviewData = {
    usersId: string[];
    isSensitive: boolean;
    group: any[];
    rejected: boolean;
};

export type ReviewData =
    | FactCheckingReviewData
    | InformativeNewsReviewData
    | RequestReviewData;

export type Review = {
    personality: string;
    usersId: string;
    isPartialReview: boolean;
};

export type SaveEvent = {
    type: string;
    reviewData: ReviewData;
    review: Review;
};

export type ReviewTaskMachineEvents = SaveEvent;
