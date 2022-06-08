import { FormField } from "./FormField";

const reportedForm: FormField[] = [
    {
        fieldName: "classification",
        type: "select",
        label: "claimReviewForm:selectLabel",
        placeholder: "claimReviewForm:placeholder",
        rules: {
            required: "common:requiredFieldError",
        },
    },
];

export default reportedForm;
