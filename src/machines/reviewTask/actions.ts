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
            ReviewTaskEvents.addRejectionComment,
            ReviewTaskEvents.viewPreview,
        ];

        if (
            supportedEvents.includes(event.type as ReviewTaskEvents) &&
            "visualEditor" in event.reviewData
        ) {
            const visualEditorJSON = event.reviewData.visualEditor.toJSON();
            const cleanedVisualEditor = editorParser.removeTrailingParagraph(
                visualEditorJSON
            );
            const schema = editorParser.editor2schema(cleanedVisualEditor);
            const reviewDataHtml = editorParser.schema2html(schema);
            event.reviewData = {
                ...event.reviewData,
                ...schema,
                reviewDataHtml,
                visualEditor: cleanedVisualEditor,
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
