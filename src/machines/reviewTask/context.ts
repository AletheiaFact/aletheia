import { ClaimReview, ReviewData } from "./events";

export type ReviewTaskMachineContextType = {
    reviewData: ReviewData;
    claimReview: ClaimReview;
};

const buildState = (reviewData): ReviewTaskMachineContextType => {
    return {
        reviewData: {
            usersId: [],
            summary: "",
            questions: [],
            report: "",
            verification: "",
            sources: [],
            classification: "",
            // initial value must be null to be able to use populate before selecting reviewer
            reviewerId: null,
            crossCheckerId: null,
            crossCheckingComments: [],
            crossCheckingComment: "",
            crossCheckingClassification: "",
            ...reviewData,
        },
        claimReview: {
            personality: "",
            claim: "",
            usersId: "",
            isPartialReview: false,
        },
    };
};

export const getInitialContext = (
    reviewData = {}
): ReviewTaskMachineContextType => {
    return buildState(reviewData);
};
