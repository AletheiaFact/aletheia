import { ReviewTaskEvents } from "./enums";
import { EditorParser } from "../../../lib/editor-parser";

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

    // Editor content required — check each block individually to report ALL missing fields
    if (!formData.visualEditor) {
        errors.push({
            field: "visualEditor",
            message: "common:requiredFieldError",
        });
    } else {
        const editorParser = new EditorParser();
        const editorJson =
            formData.visualEditor.toJSON?.() || formData.visualEditor;
        const schema = editorParser.editor2schema(editorJson);
        const SKIP_KEYS = ["paragraph", "sources"];

        for (const key in schema) {
            if (SKIP_KEYS.includes(key)) continue;
            const value = schema[key];
            const isEmpty = Array.isArray(value)
                ? value.length <= 0
                : !value?.trim();
            if (isEmpty) {
                errors.push({
                    field: "visualEditor",
                    message: `common:${key}RequiredFieldError`,
                });
            }
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
