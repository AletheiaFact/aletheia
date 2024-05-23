import api from "../../api/ClaimReviewTaskApi";
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContextType } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { saveContext } from "./actions";
import {
    CompoundStates,
    ReviewTaskEvents as Events,
    ReviewTaskStates as States,
} from "./enums";
import sendReviewNotifications from "../../notifications/sendReviewNotifications";

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

const isSameLabel = (context, event) =>
    context.reviewData.classification ===
    event.reviewData.crossCheckingClassification;

const isDifferentLabel = (context, event) =>
    context.classification !== event.reviewData.crossCheckingClassification;

export const createNewMachine = ({ value, context }) => {
    return createMachine<
        ReviewTaskMachineContextType,
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
                    [Events.reAssignUser]: {
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
                    [Events.reAssignUser]: {
                        target: States.unassigned,
                    },
                    [Events.selectedCrossChecking]: {
                        target: States.selectCrossChecker,
                    },
                    [Events.selectedReview]: {
                        target: States.selectReviewer,
                    },
                },
            },
            [States.selectCrossChecker]: {
                on: {
                    [Events.goback]: {
                        target: States.reported,
                    },
                    [Events.reAssignUser]: {
                        target: States.unassigned,
                    },
                    [Events.sendToCrossChecking]: {
                        target: States.crossChecking,
                        actions: [saveContext],
                    },
                },
            },
            [States.selectReviewer]: {
                on: {
                    [Events.goback]: {
                        target: States.reported,
                    },
                    [Events.reAssignUser]: {
                        target: States.unassigned,
                    },
                    [Events.sendToReview]: {
                        target: States.submitted,
                        actions: [saveContext],
                    },
                },
            },
            [States.crossChecking]: {
                on: {
                    [Events.addComment]: {
                        target: States.addCommentCrossChecking,
                        actions: [saveContext],
                    },
                    [Events.reAssignUser]: {
                        target: States.unassigned,
                    },
                    [Events.submitCrossChecking]: {
                        target: States.reported,
                        actions: [saveContext],
                    },
                },
            },
            [States.addCommentCrossChecking]: {
                on: {
                    [Events.goback]: {
                        target: States.crossChecking,
                    },
                    [Events.reAssignUser]: {
                        target: States.unassigned,
                    },
                    [Events.submitComment]: [
                        {
                            target: States.reported,
                            actions: [saveContext],
                            cond: isSameLabel,
                        },
                        {
                            target: States.assigned,
                            actions: [saveContext],
                            cond: isDifferentLabel,
                        },
                    ],
                },
            },
            //TODO: Investigate how to move rejected and addComment crossChecking as substates
            [States.submitted]: {
                on: {
                    [Events.reject]: {
                        target: States.rejected,
                    },
                    [Events.reAssignUser]: {
                        target: States.unassigned,
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
                    [Events.reAssignUser]: {
                        target: States.unassigned,
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
        reportModel,
        t,
        recaptchaString,
        setFormAndEvents,
        resetIsLoading,
        currentUserId,
        nameSpace,
    } = state.event;
    const event = state.event.type;

    const nextState =
        typeof state.value !== "string"
            ? Object.keys(state.value)[0]
            : state.value;

    if (
        event === Events.reject ||
        event === Events.selectedCrossChecking ||
        event === Events.selectedReview ||
        event === Events.reAssignUser
    ) {
        setFormAndEvents(nextState);
    } else if (event !== Events.init) {
        api.createClaimReviewTask(
            {
                data_hash,
                reportModel,
                machine: {
                    context: {
                        reviewData: state.context.reviewData,
                        claimReview: state.context.claimReview,
                    },
                    value: state.value,
                },
                recaptcha: recaptchaString,
                nameSpace,
            },
            t,
            event
        )
            .then(() => {
                return event === Events.goback
                    ? setFormAndEvents(nextState)
                    : setFormAndEvents(
                          event,
                          isSameLabel(state.context, state.event)
                      );
            })
            .catch((e) => {
                // TODO: Track errors with Sentry
            })
            .finally(() => resetIsLoading());
    }

    sendReviewNotifications(
        data_hash,
        event,
        state.context.reviewData,
        currentUserId,
        t
    );
};

export const createNewMachineService = (machine: any) => {
    return interpret(createNewMachine(machine))
        .onTransition(transitionHandler)
        .start();
};
