import unassignedForm from "../components/ClaimReview/form/unassignedForm";

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
    };
    formUi: any;
};

export const initialContext: ReviewTaskMachineContext = {
    reviewData: {
        userId: "",
        summary: "",
        questions: [],
        report: "",
        verification: "",
        source: [],
        classification: "",
        sentence_hash: "",
    },
    formUi: unassignedForm,
};
