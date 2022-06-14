import { RegisterOptions } from "react-hook-form";

export type FormField = {
    fieldName: string;
    label: string;
    placeholder: string;
    rules?: RegisterOptions;
    type: string;
    inputType?: string;
    addInputLabel?: string;
    defaultValue: string;
};

interface createFormFieldProps extends Partial<FormField> {
    fieldName: string;
    type: string;
    i18nKey?: string;
    i18nNamespace?: string;
}

const createFormField = (props: createFormFieldProps): FormField => {
    const {
        fieldName,
        type,
        i18nKey = fieldName,
        i18nNamespace = "claimReviewForm",
        defaultValue,
    } = props;
    return {
        fieldName,
        type,
        label: `${i18nNamespace}:${i18nKey}Label`,
        placeholder: `${i18nNamespace}:${i18nKey}Placeholder`,
        rules: {
            required: "common:requiredFieldError",
        },
        defaultValue,
        ...props,
    };
};

export { createFormField };
