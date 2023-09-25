import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";
import { EditorParser } from "../../../lib/editor-parser";
import { ReviewTaskEvents } from "./enums";

const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        const editorParser = new EditorParser();
        if (event.type === ReviewTaskEvents.finishReport) {
            const reviewData = editorParser.editor2schema(
                event.reviewData.editor
            );
            event.reviewData = {
                ...event.reviewData,
                ...reviewData,
            };
        }
        return {
            reviewData: {
                ...context.reviewData,
                ...event.reviewData,
            },
            claimReview: {
                ...context.claimReview,
                ...event.claimReview,
                isPartialReview: false,
            },
        };
    }
);

const savePartialReviewContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        const editorParser = new EditorParser();
        const reviewData = editorParser.editor2schema(event.reviewData.editor);
        event.reviewData = {
            ...event.reviewData,
            ...reviewData,
        };
        return {
            reviewData: {
                ...context.reviewData,
                ...event.reviewData,
            },
            claimReview: {
                ...context.claimReview,
                ...event.claimReview,
                isPartialReview: true,
            },
        };
    }
);

export { saveContext, savePartialReviewContext };
