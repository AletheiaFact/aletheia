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
};

export const transitionHandler = (state) => {
    const sentence_hash = state.event.sentence_hash;
    const t = state.event.t;
    const event = state.event.type;
    const recaptchaString = state.event.recaptchaString;
    const setCurrentFormAndNextEvents = state.event.setCurrentFormAndNextEvents;
    const resetIsLoading = state.event.resetIsLoading;

    if (event === ReviewTaskEvents.goback) {
        resetIsLoading();
        setCurrentFormAndNextEvents(Object.keys(state.value)[0]);
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
                resetIsLoading();
                setCurrentFormAndNextEvents(event);
                if (event === ReviewTaskEvents.publish) {
                    window.location.reload();
                }
            })
            .catch((e) => e);
    }
};

export const createNewMachineService = (machine: any) => {
    return interpret(createNewMachine(machine))
        .onTransition(transitionHandler)
        .start();
};
