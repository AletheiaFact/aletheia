import api from "../../api/ClaimReviewTaskApi";
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContextType } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { ReviewTaskEvents as Events, ReportModelEnum } from "./enums";
import sendReviewNotifications from "../../notifications/sendReviewNotifications";
import { isSameLabel, workflowMachine } from "./workflowMachine";

export const createNewMachine = ({ value, context }, reportModel) => {
    return createMachine<
        ReviewTaskMachineContextType,
        ReviewTaskMachineEvents,
        ReviewTaskMachineState
    >({
        id: ReportModelEnum[reportModel],
        initial: value,
        context,
        states: workflowMachine[reportModel],
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

export const createNewMachineService = (
    machine: any,
    reportModel: string = ReportModelEnum.FactChecking
) => {
    return interpret(createNewMachine(machine, reportModel))
        .onTransition(transitionHandler)
        .start();
};
