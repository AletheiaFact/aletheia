import { createFormField, FormField } from "./FormField";

const assignedForm: FormField[] = [
    createFormField({ fieldName: "summary", type: "textArea", defaultValue: "" }),
    createFormField({
        fieldName: "questions",
        type: "textList",
        addInputLabel: "claimReviewForm:addQuestionLabel",
        defaultValue: [],
    }),
    createFormField({ fieldName: "report", type: "textArea", defaultValue: "" }),
    createFormField({
        fieldName: "verification",
        type: "textArea",
        defaultValue: ""
    }),
    createFormField({
        fieldName: "sources",
        type: "textList",
        inputType: "url",
        i18nKey: "sources",
        addInputLabel: "claimReviewForm:addSourceLabel",
        defaultValue: [],
    }),
];

export default assignedForm;
