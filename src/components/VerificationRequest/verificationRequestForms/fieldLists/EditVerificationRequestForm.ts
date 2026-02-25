import { createFormField, FormField } from "../../../Form/FormField";

const editVerificationRequestForm: FormField[] = [
  createFormField({
    fieldName: "content",
    type: "text",
    defaultValue: "",
    i18nNamespace: "verificationRequest",
    disabled: true,
  }),
  createFormField({
    fieldName: "reportType",
    type: "selectReportType",
    defaultValue: "",
    i18nNamespace: "verificationRequest",
    disabled: true,
  }),
  createFormField({
    fieldName: "impactArea",
    type: "selectImpactArea",
    defaultValue: "",
    i18nNamespace: "verificationRequest",
    disabled: true,
  }),
  createFormField({
    fieldName: "heardFrom",
    type: "text",
    defaultValue: "",
    i18nNamespace: "verificationRequest",
    disabled: true,
  }),
  createFormField({
    fieldName: "publicationDate",
    type: "date",
    defaultValue: "",
    i18nNamespace: "verificationRequest",
  }),
  createFormField({
    fieldName: "source",
    type: "sourceList",
    defaultValue: "",
    i18nNamespace: "verificationRequest",
    required: false,
    isURLField: true,
  }),
];

export default editVerificationRequestForm;
