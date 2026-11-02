import { createFormField, FormField } from "../../Form/FormField";
import { validateParticipantDrafts } from "../Participants/participantDrafts";

const lifecycleEventForm: FormField[] = [
    createFormField({
        fieldName: "badge",
        type: "text",
        defaultValue: "",
        i18nNamespace: "events",
    }),
    createFormField({
        fieldName: "name",
        type: "text",
        defaultValue: "",
        i18nNamespace: "events",
    }),
    createFormField({
        fieldName: "description",
        type: "textArea",
        defaultValue: "",
        i18nNamespace: "events",
    }),
    createFormField({
        fieldName: "location",
        type: "text",
        defaultValue: "",
        i18nNamespace: "events",
    }),
    createFormField({
        fieldName: "startDate",
        type: "date",
        defaultValue: "",
        i18nNamespace: "events",
    }),
    createFormField({
        fieldName: "endDate",
        type: "date",
        defaultValue: "",
        i18nNamespace: "events",
        mustBeAfterField: "startDate",
    }),
    createFormField({
        fieldName: "mainTopic",
        type: "selectTopic",
        defaultValue: "",
        hasTooltip: true,
        i18nNamespace: "events",
    }),
    createFormField({
        fieldName: "participants",
        type: "participantsList",
        defaultValue: [],
        required: false,
        hasTooltip: true,
        i18nNamespace: "events",
        rules: {
            validate: { participants: validateParticipantDrafts },
        },
    }),
];

export default lifecycleEventForm;
