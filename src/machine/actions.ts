import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";

export const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        const t = event.t
        const claimReview = event.claimReview
        const reviewData = event.reviewData
        const userId = event.reviewData.userId
        return {
            reviewData: {
                ...context.reviewData,
                ...reviewData,
            },
            utils: {
                t
            },
            claimReview: {
                ...claimReview,
                userId,
            }
        };
});
