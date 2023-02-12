import { createFormField, FormField } from "../../../Form/FormField";

const summarizedForm: FormField[] = [
    createFormField({
        fieldName: "questions",
        type: "textList",
        addInputLabel: "claimReviewForm:addQuestionLabel",
        defaultValue: [],
    }),
    createFormField({
        fieldName: "report",
        type: "textArea",
        defaultValue: "",
    }),
    createFormField({
        fieldName: "verification",
        type: "textArea",
        defaultValue: "",
    }),
];

export default summarizedForm;
