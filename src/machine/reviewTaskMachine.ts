import { createMachine } from "xstate";
import { ReviewTaskMachineContext, initialContext } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { saveContext } from "./actions";
import { ReviewTaskStates } from "./enums";

export const reviewTaskMachine = createMachine<
    ReviewTaskMachineContext,
    ReviewTaskMachineEvents,
    ReviewTaskMachineState
>({
    initial: "unassigned",
    context: initialContext,
    states: {
        unassigned: {
            on: {
                ASSIGN_USER: {
                    target: ReviewTaskStates.assigned,
                    actions: [saveContext],
                },
            },
        },
        assigned: {
            on: {
                FINISH_REPORT: {
                    target: ReviewTaskStates.reported,
                    actions: [saveContext],
                },
            },
        },
        reported: {
            on: {
                PUBLISH: {
                    target: ReviewTaskStates.published,
                    actions: [saveContext],
                },
            },
        },
        published: {
            type: "final",
        },
    },
});
