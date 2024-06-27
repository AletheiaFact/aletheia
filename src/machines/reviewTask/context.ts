import { ReviewTaskTypeEnum } from "./enums";
import { ClaimReview, ReviewData } from "./events";

export type ReviewTaskMachineContextType = {
    reviewData: ReviewData;
    claimReview: ClaimReview;
};

const buildState = (
    reviewTaskType,
    reviewData
): ReviewTaskMachineContextType => {
    const baseReviewData = {
        usersId: [],
        summary: "",
        classification: "",
        // initial value must be null to be able to use populate before selecting reviewer
        reviewerId: null,
        crossCheckerId: null,
        crossCheckingComments: [],
        crossCheckingComment: "",
        crossCheckingClassification: "",
    };

    const claimReviewData = {
        questions: [],
        report: "",
        verification: "",
        sources: [],
    };

    const claimReview = {
        //TODO: change name to review
        personality: "",
        claim: "",
        source: "",
        usersId: "",
        targetId: "",
        isPartialReview: false,
    };

    if (reviewTaskType === ReviewTaskTypeEnum.VerificationRequest) {
        return {
            reviewData: {
                usersId: [],
                isSensitive: false,
                group: [],
                rejected: false,
            },
            claimReview,
        };
    }

    if (reviewTaskType === ReviewTaskTypeEnum.Source) {
        return {
            reviewData: {
                ...baseReviewData,
                ...reviewData,
            },
            claimReview,
        };
    }

    return {
        reviewData: {
            ...baseReviewData,
            ...claimReviewData,
            ...reviewData,
        },
        claimReview,
    };
};

export const getInitialContext = (
    reviewTaskType: string,
    reviewData: Partial<ReviewData> = {}
): ReviewTaskMachineContextType => buildState(reviewTaskType, reviewData);
