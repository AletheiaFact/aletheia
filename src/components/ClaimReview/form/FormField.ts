import { RegisterOptions } from "react-hook-form";

export type FormField = {
    fieldName: string;
    label: string;
    placeholder: string;
    rules?: RegisterOptions;
    type: string;
    inputType?: string;
    addInputLabel?: string;
    defaultValue: string | [];
};

interface CreateFormFieldProps extends Partial<FormField> {
    fieldName: string;
    type: string;
    i18nKey?: string;
    i18nNamespace?: string;
}

const createFormField = (props: CreateFormFieldProps): FormField => {
    const {
        fieldName,
        type,
        i18nKey = fieldName,
        i18nNamespace = "claimReviewForm",
        defaultValue,
        rules,
    } = props;
    return {
        fieldName,
        type,
        label: `${i18nNamespace}:${i18nKey}Label`,
        placeholder: `${i18nNamespace}:${i18nKey}Placeholder`,
        defaultValue,
        ...props,
        rules: {
            required: "common:requiredFieldError",
            ...rules,
            validate: {
                notBlank: (v) =>
                    validateBlank(v) || "common:requiredFieldError",
                ...rules?.validate,
            },
        },
    };
};

const validateBlank = (value): boolean => {
    return fieldValidation(value, (v) => !!v.trim());
};

const fieldValidation = (value, validationFunction) => {
    if (typeof value === "string") {
        return validationFunction(value);
    }
    if (typeof value === "object") {
        return value.every((v) => validationFunction(v));
    }
    return false;
};

export { createFormField, fieldValidation };
