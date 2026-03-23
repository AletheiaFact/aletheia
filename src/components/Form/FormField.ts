import dayjs from "dayjs";
import { Node } from "@remirror/pm/model";
import { RegisterOptions } from "react-hook-form";
import { EditorParser } from "../../../lib/editor-parser";
import { ReviewTaskMachineContextReviewData } from "../../../server/review-task/dto/create-review-task.dto";
import { Roles } from "../../types/enums";
import { URL_PATTERN } from "../../utils/ValidateFloatingLink";

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
    disabled?: boolean;
    hasTooltip?: boolean;
};

// Use to add properties specific to one type of field
type FormFieldExtraProps = {
    dataLoader?: (
        value: string,
        t: any,
        nameSpace: string,
        filterOutRoles: Roles[],
        canAssignUsers: boolean
    ) => Promise<any>;
    mode?: string;
    preloadedOptions?: string[];
};

interface CreateFormFieldProps extends Partial<FormField> {
    fieldName: string;
    type: string;
    i18nKey?: string;
    i18nNamespace?: string;
    required?: boolean;
    isURLField?: boolean;
    disabled?: boolean;
    hasTooltip?: boolean;
    mustBeAfterField?: string;
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
        isURLField = false,
        disabled = false,
        hasTooltip = false,
        mustBeAfterField,
    } = props;

    return {
        fieldName,
        type,
        label: `${i18nNamespace}:${i18nKey}Label`,
        placeholder: `${i18nNamespace}:${i18nKey}Placeholder`,
        defaultValue,
        disabled,
        hasTooltip,
        ...props,
        rules: {
            required: !disabled && required && "common:requiredFieldError",
            ...rules,
            validate: {
                ...(!disabled && required && {
                    notBlank: (v) =>
                        validateBlank(v) || "common:requiredFieldError",
                }),
                ...(!disabled && isURLField && {
                    validURL: (v) =>
                        !v ||
                        URL_PATTERN.test(v) ||
                        "sourceForm:errorMessageValidURL",
                }),

                ...(!disabled && mustBeAfterField && {
                    afterDate: (value, formValues) => {
                        const otherValue = formValues[mustBeAfterField];
                        if (!value || !otherValue) return true;
                        const isAfterOrSame = dayjs(value).isAfter(dayjs(otherValue)) || dayjs(value).isSame(dayjs(otherValue));

                        return isAfterOrSame || "common:endDateMustBeAfterStartDate";
                    }
                }),
                ...rules?.validate,
            },
        },
    };
};

const validateBlank = (value): boolean => {
    return fieldValidation(value, (v) => !!v.trim());
};

const validateSchema = (
    schema: ReviewTaskMachineContextReviewData
): boolean | string => {
    for (const key in schema) {
        const value = schema[key];
        if (Array.isArray(value) && value.length <= 0 && key !== "paragraph") {
            return `common:${key}RequiredFieldError`;
        }
        if (!Array.isArray(value) && !value.trim() && key !== "paragraph") {
            return `common:${key}RequiredFieldError`;
        }
        if (key === "source" && !URL_PATTERN.test(schema[key])) {
            return `sourceForm:errorMessageValidURL`;
        }
    }
    return true;
};

const fieldValidation = (value, validationFunction) => {
    if (value?._isAMomentObject) {
        return true;
    }

    if (dayjs.isDayjs(value)) {
        return dayjs(value).isValid()
    }

    if (Array.isArray(value) && value.length > 0 && (value[0].uid || value[0].originFileObj)) {
        return true;
    }

    if (value instanceof Node) {
        const editorParser = new EditorParser();
        const schema = editorParser.editor2schema(value.toJSON());
        return validateSchema(schema);
    }
    if (typeof value === "string") {
        return validationFunction(value);
    }
    if (Array.isArray(value)) {
        return value.every((v) => validationFunction(v));
    }
    if (typeof value === "object" && value !== null && "value" in value) {
        return validationFunction(value.value);
    }

    return false;
};

export { createFormField, fieldValidation };
