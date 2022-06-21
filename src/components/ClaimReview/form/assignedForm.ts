import { createFormField, FormField } from "./FormField";

const assignedForm: FormField[] = [
    createFormField({ fieldName: "summary", type: "textArea" }),
    createFormField({
        fieldName: "questions",
        type: "textList",
        addInputLabel: "claimReviewForm:addQuestionLabel",
    }),
    createFormField({ fieldName: "report", type: "textArea" }),
    createFormField({
        fieldName: "verification",
        type: "textArea",
    }),
    createFormField({
        fieldName: "source",
        type: "textList",
        inputType: "url",
        i18nKey: "sources",
        addInputLabel: "claimReviewForm:addSourceLabel",
    }),
];

export default assignedForm;
