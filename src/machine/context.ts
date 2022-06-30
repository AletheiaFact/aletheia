import { ClaimReview, ReviewData } from "./events";

export type ReviewTaskMachineContext = {
    reviewData: ReviewData
    claimReview: ClaimReview
    utils: {
        t: any;
        setCurrentFormAndNextEvents: any;
    };
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
                sentence_hash: "",
            },
            utils: {
                t: null,
                setCurrentFormAndNextEvents: null,
            },
            claimReview: {
                personality: "",
                claim: "",
                sentence_hash: "",
                userId: "",
            }
        }
}

export const initialContext: ReviewTaskMachineContext = buildState({});
