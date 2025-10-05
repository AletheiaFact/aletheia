import { createFormField, FormField } from "../../../Form/FormField";

const createVerificationRequestForm: FormField[] = [
    createFormField({
        fieldName: "content",
        type: "text",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
    }),
    createFormField({
        fieldName: "reportType",
        type: "selectReportType",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
        required: false,

    }),
    createFormField({
        fieldName: "impactArea",
        type: "selectImpactArea",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
        required: false

    }),
    createFormField({
        fieldName: "heardFrom",
        type: "text",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
        required: false,
    }),
    createFormField({
        fieldName: "publicationDate",
        type: "date",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
    }),
    createFormField({
        fieldName: "source",
        type: "text",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
        required: false,
        isURLField: true,
    }),
    createFormField({
        fieldName: "email",
        type: "email",
        defaultValue: "",
        i18nNamespace: "verificationRequest",
        required: false,
    }),
];

export default createVerificationRequestForm;
