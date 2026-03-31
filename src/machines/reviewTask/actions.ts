import { assign } from "xstate";
import { ReviewTaskMachineContextType } from "./context";
import { SaveEvent } from "./events";
import { EditorParser } from "../../../lib/editor-parser";
import { ReviewTaskEvents } from "./enums";

const saveContext = assign<ReviewTaskMachineContextType, SaveEvent>(
    (context, event) => {
        const editorParser = new EditorParser();
        const supportedEvents = [
            ReviewTaskEvents.finishReport,
            ReviewTaskEvents.draft,
            ReviewTaskEvents.viewPreview,
            ReviewTaskEvents.submitComment,
            ReviewTaskEvents.addComment,
            ReviewTaskEvents.sendToCrossChecking,
            ReviewTaskEvents.sendToReview,
            ReviewTaskEvents.goback,
            ReviewTaskEvents.assignUser,
            ReviewTaskEvents.submitCrossChecking,
            ReviewTaskEvents.selectedCrossChecking,
            ReviewTaskEvents.selectedReview,
        ];

        if (
            supportedEvents.includes(event.type as ReviewTaskEvents) &&
            "visualEditor" in event.reviewData &&
            typeof event.reviewData.visualEditor?.toJSON === "function"
        ) {
            const visualEditorJSON = event.reviewData.visualEditor.toJSON();
            // Remove the trailing paragraph added by Remirror's TrailingNodeExtension.
            // This empty paragraph is necessary to allow insertion of new nodes in the editor,
            // but should not be persisted in the database to avoid issues when loading content.
            const cleanedVisualEditor =
                editorParser.removeTrailingParagraph(visualEditorJSON);
            const schema = editorParser.editor2schema(cleanedVisualEditor);

            // Strip orphaned source markup {{id|text}} from content strings.
            // Sources added via button (not attached to text) produce markup
            // that can't be reconstructed on reload. The sources are preserved
            // separately in schema.sources.
            const sourceMarkupPattern = /\{\{[^|]*\|[^}]*\}\}/g;
            for (const key in schema) {
                const value = schema[key];
                if (
                    typeof value === "string" &&
                    sourceMarkupPattern.test(value)
                ) {
                    schema[key] = value.replace(sourceMarkupPattern, "").trim();
                }
            }

            const reviewDataHtml = editorParser.schema2html(schema);
            event.reviewData = {
                ...event.reviewData,
                ...schema,
                reviewDataHtml,
            };
        }
        return {
            reviewData: {
                ...context.reviewData,
                ...event.reviewData,
            },
            review: {
                ...context.review,
                ...event.review,
                isPartialReview: false,
            },
        };
    }
);

const rejectVerificationRequest = assign<
    ReviewTaskMachineContextType,
    SaveEvent
>((context) => {
    return {
        reviewData: {
            ...context.reviewData,
            rejected: true,
        },
        review: context.review,
    };
});

export { saveContext, rejectVerificationRequest };
