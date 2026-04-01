import React, { useContext, useEffect, useRef, useState } from "react";
import {
    reviewingSelector,
    reviewDataSelector,
    crossCheckingSelector,
    reportSelector,
    addCommentCrossCheckingSelector,
    currentStateSelector,
} from "../../../machines/reviewTask/selectors";

import { VisualEditorContext } from "../../Collaborative/VisualEditorProvider";
import DynamicForm from "../../Form/DynamicForm";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import {
    validateFormSubmission,
    ValidationError,
} from "../../../machines/reviewTask/validation";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import colors from "../../../styles/colors";
import AletheiaAlert from "../../AletheiaAlert";
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
        clearErrors,
        setError,
        formState: { errors },
        watch,
    } = useForm();
    const {
        reportModel,
        machineService,
        events,
        form,
        setFormAndEvents,
        reviewTaskType,
    } = useContext(ReviewTaskMachineContext);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isReported = useSelector(machineService, reportSelector);
    const { comments, editorSources } = useContext(VisualEditorContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [role] = useAtom(currentUserRole);
    const [isLoading, setIsLoading] = useState({});
    const [submitValidationErrors, setSubmitValidationErrors] = useState<
        ValidationError[]
    >([]);
    const [gobackWarningModal, setGobackWarningModal] = useState(false);
    const [finishReportWarningModal, setFinishReportWarningModal] =
        useState(false);
    const [pendingAction, setPendingAction] = useState<{
        event: string;
        data: any;
    } | null>(null);
    const pendingCaptchaToken = useRef<string>("");
    const errorAlertRef = useRef<HTMLDivElement>(null);

    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);

    // Use centralized permission system as middleware only
    const permissions = useReviewTaskPermissions();

    const currentState = useSelector(machineService, currentStateSelector);

    const resetIsLoading = () => {
        const isLoading = {};
        events?.forEach((eventName) => {
            isLoading[eventName] = false;
        });
        setIsLoading(isLoading);
    };

    useEffect(() => {
        if (isLoggedIn) {
            const state = machineService.state.value;
            const currentMachineState =
                typeof state === "string" ? state : Object.keys(state)[0];
            setFormAndEvents(currentMachineState);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        clearErrors();
        // Exclude editor-managed fields from reset to prevent
        // {{id|text}} markup strings from corrupting the Remirror editor.
        // The editor manages its own state via editorContentObject.
        const {
            visualEditor,
            summary,
            questions,
            report,
            verification,
            ...safeReviewData
        } = reviewData || {};
        reset(safeReviewData);
        resetIsLoading();
        setSubmitValidationErrors([]);
    }, [events, form]);

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
                sources: editorSources || reviewData.sources || [],
                reviewComments:
                    comments?.filter(
                        (comment) => comment.type === CommentEnum.review
                    ) || reviewData.reviewComments,
                crossCheckingComments: reviewData.crossCheckingComments,
                ...(eventName === ReviewTaskEvents.sendToReview && {
                    rejectionComment: "",
                }),
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

        if (!isValidReviewer) {
            setSubmitValidationErrors([
                {
                    field:
                        event === ReviewTaskEvents.sendToCrossChecking
                            ? "crossCheckerId"
                            : "reviewerId",
                    message: "reviewTask:invalidReviewerMessage",
                },
            ]);
        }
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

        // Centralized validation based on event type
        const validationErrors = validateFormSubmission({
            event,
            formData: data,
            editorSources: editorSources || [],
            machineSources:
                reviewData?.sources ||
                machineService.state.context.reviewData?.sources ||
                [],
        });

        if (validationErrors.length > 0) {
            setSubmitValidationErrors(validationErrors);
            setTimeout(() => {
                errorAlertRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 0);
            return;
        }

        setSubmitValidationErrors([]);

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
        // Non-exempt submit buttons are handled by onSubmit (after form validation),
        // so we don't open the captcha modal here to avoid showing errors + modal together
    };

    const handleRecaptchaConfirm = (token: string) => {
        if (!pendingAction) return;
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

    const onValidationError = (formErrors) => {
        const firstErrorField = Object.keys(formErrors)[0];
        if (firstErrorField) {
            const el = document.getElementById(`field-${firstErrorField}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
        }
        errorAlertRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const showButtons = canUserInteractWithForm();

    return (
        <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(onSubmit, onValidationError)}
        >
            {form && (
                <>
                    {(Object.keys(errors).length > 0 ||
                        submitValidationErrors.length > 0) && (
                        <div
                            ref={errorAlertRef}
                            style={{ margin: "0 20px 16px" }}
                        >
                            <AletheiaAlert
                                type="error"
                                message={t(
                                    "claimReviewForm:validationErrorTitle"
                                )}
                                showIcon
                                description={
                                    submitValidationErrors.length > 0 ? (
                                        <ul
                                            style={{
                                                margin: "8px 0 0",
                                                paddingLeft: "20px",
                                                listStyle: "none",
                                            }}
                                        >
                                            {submitValidationErrors.map(
                                                (err) => (
                                                    <li
                                                        key={err.field}
                                                        data-cy={
                                                            err.field ===
                                                                "reviewerId" ||
                                                            err.field ===
                                                                "crossCheckerId"
                                                                ? "testReviewerError"
                                                                : undefined
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                            padding: "4px 0",
                                                            color: colors.error,
                                                            fontWeight: 500,
                                                            fontSize: "13px",
                                                        }}
                                                        onClick={() => {
                                                            const el =
                                                                document.getElementById(
                                                                    `field-${err.field}`
                                                                ) ||
                                                                document.getElementById(
                                                                    "field-visualEditor"
                                                                );
                                                            el?.scrollIntoView({
                                                                behavior:
                                                                    "smooth",
                                                                block: "center",
                                                            });
                                                        }}
                                                    >
                                                        {"\u2022 "}
                                                        {err.label
                                                            ? `${t(
                                                                  err.label
                                                              )}: ${t(
                                                                  err.message
                                                              )}`
                                                            : t(err.message)}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        t(
                                            "claimReviewForm:validationErrorDescription"
                                        )
                                    )
                                }
                            />
                        </div>
                    )}
                    <DynamicForm
                        currentForm={form}
                        machineValues={reviewData}
                        control={control}
                        errors={errors}
                        submitErrors={submitValidationErrors}
                    />
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
                    setGobackWarningModal(false);
                    setPendingAction({
                        event: ReviewTaskEvents.goback,
                        data: getValues(),
                    });
                }}
                handleCancel={() => setGobackWarningModal(false)}
            />

            <WarningModal
                open={finishReportWarningModal}
                title={t("warningModal:title", {
                    warning: t("warningModal:crossCheckingClassification"),
                })}
                width={400}
                handleOk={() => {
                    handleSendEvent(ReviewTaskEvents.finishReport, null, true);
                    setFinishReportWarningModal(false);
                }}
                handleCancel={() => setFinishReportWarningModal(false)}
            />
        </form>
    );
};

export default DynamicReviewTaskForm;
