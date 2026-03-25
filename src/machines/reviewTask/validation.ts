import { ReviewTaskEvents } from "./enums";
import { fieldValidation } from "../../components/Form/FormField";

export interface ValidationError {
    field: string;
    message: string;
    label?: string;
}

export interface ValidationInput {
    event: ReviewTaskEvents;
    formData: Record<string, any>;
    editorSources: any[];
    machineSources: any[];
}

const EVENTS_REQUIRING_FULL_VALIDATION = [
    ReviewTaskEvents.finishReport,
    ReviewTaskEvents.publish,
];

const EVENTS_REQUIRING_SOURCES = [
    ReviewTaskEvents.finishReport,
    ReviewTaskEvents.publish,
];

export function validateFormSubmission(
    input: ValidationInput
): ValidationError[] {
    const { event, formData, editorSources, machineSources } = input;
    const errors: ValidationError[] = [];

    if (!EVENTS_REQUIRING_FULL_VALIDATION.includes(event)) {
        return errors;
    }

    // Classification required
    if (!formData.classification || formData.classification === "") {
        errors.push({
            field: "classification",
            label: "claimReviewForm:classificationLabel",
            message: "common:requiredFieldError",
        });
    }

    // Editor content required — each block must have text
    if (formData.visualEditor) {
        const validationResult = fieldValidation(
            formData.visualEditor,
            (v) => !!v?.trim()
        );
        if (validationResult !== true) {
            errors.push({
                field: "visualEditor",
                message:
                    typeof validationResult === "string"
                        ? validationResult
                        : "common:requiredFieldError",
            });
        }
    }

    // Sources required on finishReport and publish
    if (EVENTS_REQUIRING_SOURCES.includes(event)) {
        const hasSources =
            (editorSources && editorSources.length > 0) ||
            (machineSources && machineSources.length > 0);
        if (!hasSources) {
            errors.push({
                field: "sources",
                message: "common:sourceRequiredFieldError",
            });
        }
    }

    return errors;
}
