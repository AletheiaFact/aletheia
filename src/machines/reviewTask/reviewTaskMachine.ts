import api from "../../api/reviewTaskApi";
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContextType } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { ReviewTaskEvents as Events, ReportModelEnum } from "./enums";
import sendReviewNotifications from "../../notifications/sendReviewNotifications";
import { isSameLabel, machineWorkflow } from "./machineWorkflow";

export const createNewMachine = ({ value, context }, reportModel) => {
    return createMachine<
        ReviewTaskMachineContextType,
        ReviewTaskMachineEvents,
        ReviewTaskMachineState
    >({
        id: ReportModelEnum[reportModel],
        initial: value,
        context,
        states: machineWorkflow[reportModel],
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
        reviewTaskType,
        target,
    } = state.event;
    const event = state.event.type;
    const { value } = state;
    const { reviewData, review } = state.context;
    const nextState = typeof value !== "string" ? Object.keys(value)[0] : value;

    const shouldNotUpdateReviewTask =
        event === Events.reject ||
        event === Events.selectedCrossChecking ||
        event === Events.selectedReview ||
        event === Events.reAssignUser;

    if (event === Events.init || event === Events.viewPreview) {
        return;
    }

    if (shouldNotUpdateReviewTask) {
        return setFormAndEvents(nextState);
    }

    const reviewTask = {
        data_hash,
        reportModel,
        machine: {
            context: {
                reviewData,
                review,
            },
            value: value,
        },
        recaptcha: recaptchaString,
        nameSpace,
        reviewTaskType,
        target,
    };

    api.createReviewTask(reviewTask, t, event)
        .then(() => {
            if (
                reportModel === ReportModelEnum.Request &&
                value === "published"
            ) {
                window.location.href = `/claim/create?verificationRequest=${target}`;
            }

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

    sendReviewNotifications(data_hash, event, reviewData, currentUserId, t);
};

export const createNewMachineService = (
    machine: any,
    reportModel: string = ReportModelEnum.FactChecking
) => {
    return interpret(createNewMachine(machine, reportModel))
        .onTransition(transitionHandler)
        .start();
};
