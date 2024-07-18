import { ReviewTaskTypeEnum } from "./enums";
import { Review, ReviewData } from "./events";

export type ReviewTaskMachineContextType = {
    reviewData: ReviewData;
    review: Review;
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

    const review = {
        personality: "",
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
            review,
        };
    }

    if (reviewTaskType === ReviewTaskTypeEnum.Source) {
        return {
            reviewData: {
                ...baseReviewData,
                ...reviewData,
            },
            review,
        };
    }

    return {
        reviewData: {
            ...baseReviewData,
            ...claimReviewData,
            ...reviewData,
        },
        review,
    };
};

export const getInitialContext = (
    reviewTaskType: string,
    reviewData: Partial<ReviewData> = {}
): ReviewTaskMachineContextType => buildState(reviewTaskType, reviewData);
