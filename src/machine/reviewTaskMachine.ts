import { createMachine } from "xstate"
import { reviewTaskMachineContext, initialContext } from "./context"
import { reviewTaskMachineEvents } from "./events"
import { reviewTaskMachineState } from "./states"
import { assignedUser, report } from "./actions"

export const reviewTaskMachine = createMachine<reviewTaskMachineContext, reviewTaskMachineEvents, reviewTaskMachineState>({
    initial: "unassigned",
    context: initialContext,
    states: {
        unassigned: {
            on: {
                ASSIGN_USER: {
                    target: "assigned",
                    actions: [assignedUser]
                }
            }
        },
        assigned: {
            on: {
                REPORT_FINISHED: {
                    target: "reported",
                    actions: [report]
                },
            }
        },
        reported: {
            on: {
                PUBLISHED: {
                    target: "published",
                }
            }
        },        
        published: {
            type: "final"
        }
    },
})