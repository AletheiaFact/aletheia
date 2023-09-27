import api from "../../api/ClaimReviewTaskApi";
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { saveContext } from "./actions";
import {
    CompoundStates,
    ReviewTaskEvents as Events,
    ReviewTaskStates as States,
} from "./enums";

const draftSubStates = {
    initial: CompoundStates.undraft,
    states: {
        undraft: {
            on: {
                SAVE_DRAFT: {
                    target: CompoundStates.draft,
                    actions: [saveContext],
                },
            },
        },
        draft: {
            on: {
                SAVE_DRAFT: {
                    target: CompoundStates.draft,
                    actions: [saveContext],
                },
            },
        },
    },
};

export const createNewMachine = ({ value, context }) => {
    return createMachine<
        ReviewTaskMachineContext,
        ReviewTaskMachineEvents,
        ReviewTaskMachineState
    >({
        initial: value,
        context,
        states: {
            [States.unassigned]: {
                on: {
                    [Events.assignUser]: {
                        target: States.assigned,
                        actions: [saveContext],
                    },
                },
            },
            [States.assigned]: {
                ...draftSubStates,
                on: {
                    [Events.goback]: {
                        target: States.unassigned,
                    },
                    [Events.finishReport]: {
                        target: States.reported,
                        actions: [saveContext],
                    },
                },
            },
            [States.reported]: {
                on: {
                    [Events.goback]: {
                        target: States.assigned,
                    },

                    [Events.submit]: {
                        target: States.submitted,
                        actions: [saveContext],
                    },
                },
            },
            [States.submitted]: {
                on: {
                    [Events.reject]: {
                        target: States.rejected,
                    },
                    [Events.publish]: {
                        target: States.published,
                        actions: [saveContext],
                    },
                },
            },
            [States.rejected]: {
                on: {
                    [Events.addRejectionComment]: {
                        target: States.assigned,
                        actions: [saveContext],
                    },
                    [Events.goback]: {
                        target: States.submitted,
                    },
                },
            },
            [States.published]: {
                type: "final",
            },
        },
    });
};

/**
 * Intercepts the event sent to the machine to save the context on the database
 */
export const transitionHandler = (state) => {
    const {
        data_hash,
        t,
        recaptchaString,
        setCurrentFormAndNextEvents,
        resetIsLoading,
    } = state.event;
    const event = state.event.type;

    const nextState =
        typeof state.value !== "string"
            ? Object.keys(state.value)[0]
            : state.value;

    if (event === Events.reject) {
        setCurrentFormAndNextEvents(nextState);
    } else if (event !== Events.init) {
        api.createClaimReviewTask(
            {
                data_hash,
                machine: {
                    context: {
                        reviewData: state.context.reviewData,
                        claimReview: state.context.claimReview,
                    },
                    value: state.value,
                },
                recaptcha: recaptchaString,
            },
            t,
            event
        )
            .then(() => {
                return event === Events.goback
                    ? setCurrentFormAndNextEvents(nextState)
                    : setCurrentFormAndNextEvents(event);
            })
            .catch((e) => {
                // TODO: Track errors with Sentry
            })
            .finally(() => resetIsLoading());
    }
};

export const createNewMachineService = (machine: any) => {
    return interpret(createNewMachine(machine))
        .onTransition(transitionHandler)
        .start();
};
