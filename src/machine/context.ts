export type ReviewTaskMachineContext = {
    reviewData: {
        userId: string;
        summary: string;
        questions: string[];
        report: string;
        verification: string;
        source: string[];
        classification: string;
        sentence_hash: string;
        personality: string;
        claim: string;
    };
    utils: {
        t: any;
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
                source: [],
                classification: "",
                sentence_hash: "",
                personality: "",
                claim: "",
            },
            utils: {
                t: null,
            },
        }
}

export const initialContext: ReviewTaskMachineContext = buildState({});
