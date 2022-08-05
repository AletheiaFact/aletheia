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
            usersId: "",
            summary: "",
            questions: [],
            report: "",
            verification: "",
            sources: [],
            classification: "",
        },
        claimReview: {
            personality: "",
            claim: "",
            usersId: "",
        },
    };
};

export const initialContext: ReviewTaskMachineContext = buildState({});
