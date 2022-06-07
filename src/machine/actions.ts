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
                ...context.utils,
                t
            }
        };
});

export const returnForm = assign<ReviewTaskMachineContext, SaveEvent>(
    (context, event) => {
        return {
            formUi: event.formUi
        };
});
