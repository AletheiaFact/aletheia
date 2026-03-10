import { createFormField, FormField } from "../../Form/FormField";

const lifecycleEventForm: FormField[] = [
    createFormField({
        fieldName: "badge",
        type: "text",
        defaultValue: "",
        i18nNamespace: "events"
    }),
    createFormField({
        fieldName: "name",
        type: "text",
        defaultValue: "",
        i18nNamespace: "events"
    }),
    createFormField({
        fieldName: "description",
        type: "textArea",
        defaultValue: "",
        i18nNamespace: "events"
    }),
    createFormField({
        fieldName: "location",
        type: "text",
        defaultValue: "",
        i18nNamespace: "events"
    }),
    createFormField({
        fieldName: "startDate",
        type: "date",
        defaultValue: "",
        i18nNamespace: "events"
    }),
    createFormField({
        fieldName: "endDate",
        type: "date",
        defaultValue: "",
        i18nNamespace: "events"
    }),
    createFormField({
        fieldName: "mainTopic",
        type: "selectImpactArea", //standardize the type and component to a more generic name
        defaultValue: "",
        hasTooltip: true,
        i18nNamespace: "events",
    }),
];

export default lifecycleEventForm;
