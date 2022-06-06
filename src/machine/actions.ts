import { assign } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { SaveEvent } from "./events";

export const saveContext = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        return {
            reviewData:{
                ...context.reviewData,
                ...event,
            },
            formUi: event.formUi
        };
});
