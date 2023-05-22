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
    extraProps?: FormFieldExtraProps;
};

export enum AutoCompleteType {
    INPUT_SEARCH,
    INPUT_TOPIC,
}

// Use to add properties specific to one type of field
type FormFieldExtraProps = {
    dataLoader?: (value: string, t: any) => Promise<any>;
    mode?: string;
    preloadedOptions?: string[];
};

interface CreateFormFieldProps extends Partial<FormField> {
    fieldName: string;
    type: string;
    i18nKey?: string;
    i18nNamespace?: string;
    required?: boolean;
}

const createFormField = (props: CreateFormFieldProps): FormField => {
    const {
        fieldName,
        type,
        i18nKey = fieldName,
        i18nNamespace = "claimReviewForm",
        defaultValue,
        rules,
        required = true,
    } = props;
    return {
        fieldName,
        type,
        label: `${i18nNamespace}:${i18nKey}Label`,
        placeholder: `${i18nNamespace}:${i18nKey}Placeholder`,
        defaultValue,
        ...props,
        rules: {
            required: required && "common:requiredFieldError",
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
