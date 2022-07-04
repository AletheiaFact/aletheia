import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";

export const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        const claimReview = event.claimReview
        const reviewData = event.reviewData
        const userId = event.reviewData.userId
        return {
            reviewData: {
                ...context.reviewData,
                ...reviewData,
            },
            claimReview: {
                ...claimReview,
                userId,
            }
        };
});
