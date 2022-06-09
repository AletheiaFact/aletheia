import api from '../api/ClaimReviewTaskApi'
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContext, initialContext } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { saveContext, returnForm } from "./actions";
import { ReviewTaskEvents, ReviewTaskStates } from "./enums";

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
            entry: returnForm,
            on: {
                FINISH_REPORT: {
                    target: ReviewTaskStates.reported,
                    actions: [saveContext],
                },
            },
        },
        reported: {
            entry: returnForm,
            on: {
                PUBLISH: {
                    target: ReviewTaskStates.published,
                    actions: [saveContext],
                },
            },
        },
        published: {
            entry: returnForm,
            type: "final",
        },
    },
});

export const reviewTaskService = interpret(reviewTaskMachine)
    .onTransition((state) => {
        if (state.changed) {
            const sentence_hash = state.context.reviewData.sentence_hash
            const t = state.context.utils.t
            switch (state.event.type) {
                case ReviewTaskEvents.assignUser:
                    api.createClaimReviewTask({ sentence_hash, machine: state }, t)
                    break;
                case ReviewTaskEvents.finishReport:
                    api.updateClaimReviewTask({ sentence_hash, machine: state }, t)
                    break;
                case ReviewTaskEvents.publish:
                    api.updateClaimReviewTask({ sentence_hash, machine: state }, t)
                    break;
            }
        }})
        .start();