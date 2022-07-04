import { ClaimReview, ReviewData } from "./events";

export type ReviewTaskMachineContext = {
    reviewData: ReviewData
    claimReview: ClaimReview
};

const buildState = ({ reviewData } : { reviewData?: any }) : ReviewTaskMachineContext => {
        return {
            reviewData: reviewData || {
                userId: "",
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
                userId: "",
            }
        }
}

export const initialContext: ReviewTaskMachineContext = buildState({});
