import unassignedForm from "../components/ClaimReview/form/unassinedForm";

export type reviewTaskMachineContext = {
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

export const initialContext: reviewTaskMachineContext = {
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
