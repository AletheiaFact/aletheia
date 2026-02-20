import React, { useContext, useEffect, useRef, useState } from "react";
import {
    reviewingSelector,
    reviewDataSelector,
    crossCheckingSelector,
    reportSelector,
    addCommentCrossCheckingSelector,
} from "../../../machines/reviewTask/selectors";

import { VisualEditorContext } from "../../Collaborative/VisualEditorProvider";
import DynamicForm from "../../Form/DynamicForm";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import Typography from "@mui/material/Typography";
import colors from "../../../styles/colors";
import {
    isUserLoggedIn,
    currentUserId,
    currentUserRole,
} from "../../../atoms/currentUser";
import { trackUmamiEvent } from "../../../lib/umami";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useSelector } from "@xstate/react";
import { useTranslation } from "next-i18next";
import WarningModal from "../../Modal/WarningModal";
import RecaptchaModal from "../../Modal/RecaptchaModal";
import { currentNameSpace } from "../../../atoms/namespace";
import { CommentEnum, Roles } from "../../../types/enums";
import useAutoSaveDraft from "./hooks/useAutoSaveDraft";
import { useReviewTaskPermissions } from "../../../machines/reviewTask/usePermissions";
import ActionToolbar, { CAPTCHA_EXEMPT_EVENTS } from "./ActionToolbar";

const DynamicReviewTaskForm = ({
    data_hash,
    personality,
    target,
    canInteract = true,
}) => {
    const {
        handleSubmit,
        control,
        getValues,
        reset,
        formState: { errors },
        watch,
    } = useForm();
    const { reportModel } = useContext(ReviewTaskMachineContext);
    const { machineService, events, form, setFormAndEvents, reviewTaskType } =
        useContext(ReviewTaskMachineContext);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isReported = useSelector(machineService, reportSelector);
    const { comments } = useContext(VisualEditorContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [role] = useAtom(currentUserRole);
    const [isLoading, setIsLoading] = useState({});
    const [reviewerError, setReviewerError] = useState(false);
    const [gobackWarningModal, setGobackWarningModal] = useState(false);
    const [finishReportWarningModal, setFinishReportWarningModal] =
        useState(false);
    const [pendingAction, setPendingAction] = useState<{
        event: string;
        data: any;
    } | null>(null);
    const pendingCaptchaToken = useRef<string>("");

    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);

    // Use centralized permission system as middleware only
    const permissions = useReviewTaskPermissions();

    const currentState = useSelector(
        machineService,
        (state: { value: string | Record<string, unknown> }) => {
            const value = state.value;
            return typeof value === "string" ? value : Object.keys(value)[0];
        }
    );

    const resetIsLoading = () => {
        const isLoading = {};
        events?.forEach((eventName) => {
            isLoading[eventName] = false;
        });
        setIsLoading(isLoading);
    };

    useEffect(() => {
        if (isLoggedIn) {
            setFormAndEvents(machineService.machine.config.initial);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        reset(reviewData);
        resetIsLoading();
        setReviewerError(false);
    }, [events]);

    useAutoSaveDraft(data_hash, personality, target, watch);

    const sendEventToMachine = (formData, eventName) => {
        setIsLoading((current) => ({ ...current, [eventName]: true }));

        // Filter out visualEditor for events that don't need it (navigation, selection, and comment-only events)
        const eventsWithoutVisualEditor = [
            ReviewTaskEvents.addRejectionComment,
            ReviewTaskEvents.confirmRejection,
            ReviewTaskEvents.selectedCrossChecking,
            ReviewTaskEvents.sendToCrossChecking,
            ReviewTaskEvents.selectedReview,
            ReviewTaskEvents.sendToReview,
            ReviewTaskEvents.goback,
            ReviewTaskEvents.reAssignUser,
            ReviewTaskEvents.viewPreview,
            ReviewTaskEvents.addComment,
            ReviewTaskEvents.submitCrossChecking,
            ReviewTaskEvents.submitComment, // Cross-checking comment submission uses separate form fields
        ];

        const filteredFormData = eventsWithoutVisualEditor.includes(eventName)
            ? Object.fromEntries(
                  Object.entries(formData).filter(
                      ([key]) => key !== "visualEditor"
                  )
              )
            : formData;

        const payload = {
            data_hash,
            reportModel,
            reviewData: {
                ...filteredFormData,
                reviewComments:
                    comments?.filter(
                        (comment) => comment.type === CommentEnum.review
                    ) || reviewData.reviewComments,
                crossCheckingComments: reviewData.crossCheckingComments,
            },
            review: {
                personality,
            },
            reviewTaskType,
            target,
            type: eventName,
            t,
            recaptchaString: pendingCaptchaToken.current,
            setFormAndEvents,
            resetIsLoading,
            currentUserId: userId,
            nameSpace,
        };
        machineService.send(eventName, payload);
        pendingCaptchaToken.current = "";
    };

    const validateSelectedReviewer = (data, event) => {
        const isValidReviewer =
            event === ReviewTaskEvents.sendToCrossChecking
                ? !data.crossCheckerId ||
                !reviewData.usersId.includes(data.crossCheckerId)
                : !data.reviewerId ||
                !reviewData.usersId.includes(data.reviewerId);

        setReviewerError(!isValidReviewer);
        return isValidReviewer;
    };

    const scrollToTop = (event) => {
        const eventsToScroll = [
            ReviewTaskEvents.goback,
            ReviewTaskEvents.finishReport,
            ReviewTaskEvents.publish,
            ReviewTaskEvents.submitComment,
            ReviewTaskEvents.sendToCrossChecking,
            ReviewTaskEvents.sendToReview,
            ReviewTaskEvents.submitCrossChecking,
            ReviewTaskEvents.addRejectionComment,
        ];

        if (eventsToScroll.includes(event)) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const handleSendEvent = async (
        event,
        machineContext = null,
        force = false
    ) => {
        const context = machineContext || getValues();
        const shouldShowFinishReportWarning =
            !force &&
            event === ReviewTaskEvents.finishReport &&
            context.crossCheckingClassification !== "" &&
            context.classification !== context.crossCheckingClassification;

        if (shouldShowFinishReportWarning) {
            setFinishReportWarningModal(!finishReportWarningModal);
        } else {
            sendEventToMachine(context, event);
        }

        scrollToTop(event);
    };

    /**
     * Send event to machine validating form rules
     * @param data data from form submit
     * @param e event
     */
    const onSubmit = async (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute("event");
        if (!validateSelectedReviewer(data, event)) return;

        if (CAPTCHA_EXEMPT_EVENTS.includes(event)) {
            handleSendEvent(event, data);
        } else {
            setPendingAction({ event, data });
        }
    };

    const defineButtonHtmlType = (event) => {
        return event === ReviewTaskEvents.goback ||
            event === ReviewTaskEvents.draft
            ? "button"
            : "submit";
    };

    const handleOnClick = (event) => {
        trackUmamiEvent(`${event}_BUTTON`, "Fact-checking workflow");
        if (event === ReviewTaskEvents.goback)
            setGobackWarningModal(!gobackWarningModal);
        else if (event === ReviewTaskEvents.draft) handleSendEvent(event);
        else if (!CAPTCHA_EXEMPT_EVENTS.includes(event)) {
            setPendingAction({ event, data: getValues() });
        }
    };

    const handleRecaptchaConfirm = (token: string) => {
        pendingCaptchaToken.current = token;
        const { event, data } = pendingAction;
        setPendingAction(null);
        handleSendEvent(event, data);
    };

    const handleRecaptchaCancel = () => {
        setPendingAction(null);
    };

    // Check if user can perform any actions as middleware
    const canUserInteractWithForm = () => {
        // If no events from state machine, no buttons
        if (!events || events.length === 0) return false;

        // Use permissions as middleware to check if user can perform any action
        return permissions.showForm && canInteract;
    };

    const showButtons = canUserInteractWithForm();

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {form && (
                <>
                    <DynamicForm
                        currentForm={form}
                        machineValues={reviewData}
                        control={control}
                        errors={errors}
                    />
                    <div style={{ paddingBottom: 20, marginLeft: 20 }}>
                        {reviewerError && (
                            <Typography
                                variant="body1"
                                style={{ color: colors.error, fontSize: 16 }}
                                data-cy="testReviewerError"
                            >
                                {t("reviewTask:invalidReviewerMessage")}
                            </Typography>
                        )}
                    </div>
                </>
            )}
            {showButtons && (
                <ActionToolbar
                    events={events}
                    permissions={permissions}
                    isLoading={isLoading}
                    currentState={currentState}
                    onButtonClick={handleOnClick}
                    defineButtonHtmlType={defineButtonHtmlType}
                />
            )}

            <RecaptchaModal
                open={pendingAction !== null}
                onConfirm={handleRecaptchaConfirm}
                onCancel={handleRecaptchaCancel}
            />

            <WarningModal
                open={gobackWarningModal}
                title={t("warningModal:title", {
                    warning: t("warningModal:gobackWarning"),
                })}
                width={400}
                handleOk={() => {
                    handleSendEvent(ReviewTaskEvents.goback);
                    setGobackWarningModal(!gobackWarningModal);
                }}
                handleCancel={() => setGobackWarningModal(!gobackWarningModal)}
            />

            <WarningModal
                open={finishReportWarningModal}
                title={t("warningModal:title", {
                    warning: t("warningModal:crossCheckingClassification"),
                })}
                width={400}
                handleOk={() => {
                    handleSendEvent(ReviewTaskEvents.finishReport, null, true);
                    setFinishReportWarningModal(!finishReportWarningModal);
                }}
                handleCancel={() =>
                    setFinishReportWarningModal(!finishReportWarningModal)
                }
            />
        </form>
    );
};

export default DynamicReviewTaskForm;
