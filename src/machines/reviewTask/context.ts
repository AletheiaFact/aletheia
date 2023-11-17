import { ClaimReview, ReviewData } from "./events";

export type ReviewTaskMachineContext = {
    reviewData: ReviewData;
    claimReview: ClaimReview;
};

const buildState = ({
    reviewData,
}: {
    reviewData?: any;
}): ReviewTaskMachineContext => {
    return {
        reviewData: reviewData || {
            usersId: [],
            summary: "",
            questions: [],
            report: "",
            verification: "",
            sources: [],
            classification: "",
            rejectionComment: "",
            // initial value must be null to be able to use populate before selecting reviewer
            reviewerId: null,
            crossCheckerId: null,
            crossCheckingComments: [],
            crossCheckingComment: "",
            crossCheckingClassification: "",
        },
        claimReview: {
            personality: "",
            claim: "",
            usersId: "",
            isPartialReview: false,
        },
    };
};

export const initialContext: ReviewTaskMachineContext = buildState({});
