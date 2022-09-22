import api from "../api/ClaimReviewTaskApi";
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContext } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { saveContext } from "./actions";
import { CompoundStates, ReviewTaskEvents, ReviewTaskStates } from "./enums";

export const createNewMachine = ({ value, context }) => {
    return createMachine<
        ReviewTaskMachineContext,
        ReviewTaskMachineEvents,
        ReviewTaskMachineState
    >({
        initial: value,
        context,
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
                on: {
                    GO_BACK: {
                        target: ReviewTaskStates.unassigned,
                    },
                    FINISH_REPORT: {
                        target: ReviewTaskStates.reported,
                        actions: [saveContext],
                    },
                },
            },
            reported: {
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
                on: {
                    GO_BACK: {
                        target: ReviewTaskStates.assigned,
                    },

                    SUBMIT: {
                        target: ReviewTaskStates.submitted,
                        actions: [saveContext],
                    },
                },
            },
            submitted: {
                on: {
                    GO_BACK: {
                        target: ReviewTaskStates.reported,
                    },
                    REJECT: {
                        target: ReviewTaskStates.rejected,
                    },
                    PUBLISH: {
                        target: ReviewTaskStates.published,
                        actions: [saveContext],
                    },
                },
            },
            rejected: {
                on: {
                    ADD_REJECTION_COMMENT: {
                        target: ReviewTaskStates.assigned,
                        actions: [saveContext],
                    },
                    GO_BACK: {
                        target: ReviewTaskStates.submitted,
                    },
                },
            },
            published: {
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
        sentence_hash,
        t,
        recaptchaString,
        setCurrentFormAndNextEvents,
        resetIsLoading,
    } = state.event;
    const event = state.event.type;

    if (
        event === ReviewTaskEvents.goback ||
        event === ReviewTaskEvents.reject
    ) {
        const nextState =
            typeof state.value !== "string"
                ? Object.keys(state.value)[0]
                : state.value;
        setCurrentFormAndNextEvents(nextState);
    } else if (event !== ReviewTaskEvents.init) {
        api.createClaimReviewTask(
            {
                sentence_hash,
                machine: { context: state.context, value: state.value },
                recaptcha: recaptchaString,
            },
            t,
            event
        )
            .then(() => {
                setCurrentFormAndNextEvents(event);
            })
            .catch((e) => console.log(e))
            .finally(() => resetIsLoading());
    }
};

export const createNewMachineService = (machine: any) => {
    return interpret(createNewMachine(machine))
        .onTransition(transitionHandler)
        .start();
};
