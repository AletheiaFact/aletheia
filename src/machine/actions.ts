import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";

export const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        const t = event.t
        return {
            reviewData:{
                ...context.reviewData,
                ...event,
            },
            utils: {
                t
            }
        };
});