import { FormField } from "./FormField";

const assignedForm: FormField[] = [
    {
        fieldName: "summary",
        type: "textArea",
        label: "claimReviewForm:summaryLabel",
        placeholder: "claimReviewForm:summaryPlaceholder",
        rules: {
            required: "common:requiredFieldError",
        },
    },
    {
        fieldName: "questions",
        type: "textList",
        label: "claimReviewForm:questionsLabel",
        placeholder: "claimReviewForm:questionsPlaceholder",
        rules: {
            required: "common:requiredFieldError",
        },
    },
    {
        fieldName: "report",
        type: "textArea",
        label: "claimReviewForm:reportLabel",
        placeholder: "claimReviewForm:reportPlaceholder",
        rules: {
            required: "common:requiredFieldError",
        },
    },
    {
        fieldName: "verification",
        type: "textArea",
        label: "claimReviewForm:verificationLabel",
        placeholder: "claimReviewForm:verificationPlaceholder",
        rules: {
            required: "common:requiredFieldError",
        },
    },
    {
        fieldName: "source",
        type: "textList",
        label: "claimReviewForm:sourcesLabel",
        placeholder: "claimReviewForm:sourcesPlaceholder",
        inputType: "url",
        rules: {
            required: "common:requiredFieldError",
        },
    },
];

export default assignedForm;
