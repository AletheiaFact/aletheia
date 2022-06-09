import { FormField } from "../components/ClaimReview/form/FormField";
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
    utils: {
        t: any;
    };
    formUi: FormField[];
};

const buildState = ({ reviewData, formUi } : { reviewData?: any, formUi?: FormField[] }) : ReviewTaskMachineContext => {
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
            },
            utils: {
                t: null,
            },
            formUi: formUi || unassignedForm,
        }
}

export const initialContext: ReviewTaskMachineContext = buildState({});
