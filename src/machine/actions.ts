import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";

export const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        const utils = Object.assign(
            { t: event.t },
            { setCurrentFormAndNextEvents: event.setCurrentFormAndNextEvents }
        )
        
        const claimReview = event.claimReview
        const reviewData = event.reviewData
        const userId = event.reviewData.userId
        return {
            reviewData: {
                ...context.reviewData,
                ...reviewData,
            },
            utils: {
                ...utils
            },
            claimReview: {
                ...claimReview,
                userId,
            }
        };
});
