import { createFormField, FormField } from "./FormField";

const assignedForm: FormField[] = [
    createFormField({ fieldName: "summary", type: "textArea" }),
    createFormField({ fieldName: "questions", type: "textList" }),
    createFormField({ fieldName: "report", type: "textArea" }),
    createFormField({ fieldName: "verification", type: "textArea" }),
    createFormField({
        fieldName: "source",
        type: "textList",
        inputType: "url",
        i18nKey: "sources",
    }),
];

export default assignedForm;
