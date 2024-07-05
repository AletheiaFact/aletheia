import api from "../../api/reviewTaskApi";
import { createMachine, interpret } from "xstate";
import { ReviewTaskMachineContextType } from "./context";
import { ReviewTaskMachineEvents } from "./events";
import { ReviewTaskMachineState } from "./states";
import { ReviewTaskEvents as Events, ReportModelEnum } from "./enums";
import sendReviewNotifications from "../../notifications/sendReviewNotifications";
import { isSameLabel, machineWorkflow } from "./machineWorkflow";
import verificationRequestApi from "../../api/verificationRequestApi";

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

    const shouldUpdateVerificationRequest =
        (value === "published" || value === "rejectedRequest") &&
        reportModel === ReportModelEnum.Request;

    const shouldNotUpdateReviewTask =
        event === Events.reject ||
        event === Events.selectedCrossChecking ||
        event === Events.selectedReview ||
        event === Events.reAssignUser;

    if (event === Events.init) {
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
        .then(async () => {
            if (shouldUpdateVerificationRequest) {
                const redirectUrl = `/claim/create?verificationRequest=${review.targetId}`;
                await verificationRequestApi.updateVerificationRequest(
                    review.targetId,
                    { ...reviewData }
                );

                if (value === "published") {
                    window.location.href = redirectUrl;
                }
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
