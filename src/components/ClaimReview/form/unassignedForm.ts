import { FormField } from "./FormField";

const unassignedForm: FormField[] = [
    {
        fieldName: "userId",
        label: "claimReviewForm:assignUserLabel",
        type: "inputSearch",
        placeholder: "claimReviewForm:assignUserPlaceholder",
        rules: {
            required: "common:requiredFieldError",
        },
    },
];

export default unassignedForm;
