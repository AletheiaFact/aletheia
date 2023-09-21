import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";

const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
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
