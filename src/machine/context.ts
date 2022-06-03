import unassignedForm from "../components/ClaimReview/form/unassignedForm";

export type ReviewTaskMachineContext = {
    reviewData: {
        userId: string;
        sentence_hash: string;
        summary: string;
        questions: string[];
        report: string;
        verification: string;
        source: string[];
        classification: string;
    };
    formUi: any;
};

export const initialContext: ReviewTaskMachineContext = {
    reviewData: {
        userId: "",
        sentence_hash: "",
        summary: "",
        questions: [],
        report: "",
        verification: "",
        source: [],
        classification: "",
    },
    formUi: unassignedForm,
};
