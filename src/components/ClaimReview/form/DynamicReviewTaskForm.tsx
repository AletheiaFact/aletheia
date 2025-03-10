import AletheiaButton, { ButtonType } from "../../Button";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    reviewingSelector,
    reviewDataSelector,
    crossCheckingSelector,
    reportSelector,
} from "../../../machines/reviewTask/selectors";

import AletheiaCaptcha from "../../AletheiaCaptcha";
import { VisualEditorContext } from "../../Collaborative/VisualEditorProvider";
import DynamicForm from "../../Form/DynamicForm";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { Grid, Typography } from "@mui/material"
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
import { currentNameSpace } from "../../../atoms/namespace";
import { CommentEnum, Roles } from "../../../types/enums";
import useAutoSaveDraft from "./hooks/useAutoSaveDraft";

const DynamicReviewTaskForm = ({ data_hash, personality, target }) => {
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
    const isReported = useSelector(machineService, reportSelector);
    const { comments } = useContext(VisualEditorContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [role] = useAtom(currentUserRole);
    const [isLoading, setIsLoading] = useState({});
    const [reviewerError, setReviewerError] = useState(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const [gobackWarningModal, setGobackWarningModal] = useState(false);
    const [finishReportWarningModal, setFinishReportWarningModal] =
        useState(false);
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);

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
        const payload = {
            data_hash,
            reportModel,
            reviewData: {
                ...formData,
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
            recaptchaString,
            setFormAndEvents,
            resetIsLoading,
            currentUserId: userId,
            nameSpace,
        };
        machineService.send(eventName, payload);
        setRecaptchaString("");
        recaptchaRef.current?.resetRecaptcha();
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
        if (validateSelectedReviewer(data, event)) {
            handleSendEvent(event, data);
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
    };

    const checkIfUserCanSeeButtons = (): boolean => {
        const userIsReviewer = reviewData.reviewerId === userId;
        const userIsCrossChecker = reviewData.crossCheckerId === userId;
        const userIsAssignee = reviewData.usersId.includes(userId);
        const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;

        if (
            isReported &&
            !userIsAssignee &&
            !userIsCrossChecker &&
            !userIsAdmin
        ) {
            return false;
        }
        if (isCrossChecking) {
            return userIsCrossChecker || userIsAdmin;
        }
        if (isReviewing) {
            return userIsReviewer || userIsAdmin;
        }
        return true;
    };

    const showButtons = checkIfUserCanSeeButtons();

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
                            <Typography variant="body1" style={{ color: colors.error, fontSize: 16 }} data-cy="testReviewerError">
                                {t("reviewTask:invalidReviewerMessage")}
                            </Typography>
                        )}
                    </div>
                    {events?.length > 0 && showButtons && (
                        <AletheiaCaptcha
                            onChange={setRecaptchaString}
                            ref={recaptchaRef}
                        />
                    )}
                </>
            )}
            {showButtons && (
                <Grid container
                    style={{
                        padding: "32px 0 0",
                        justifyContent: "space-evenly",
                        gap: "10px"
                    }}
                >
                    {events?.map((event) => {
                        return (
                            <AletheiaButton
                                loading={isLoading[event]}
                                key={event}
                                type={ButtonType.blue}
                                htmlType={defineButtonHtmlType(event)}
                                onClick={() => handleOnClick(event)}
                                event={event}
                                disabled={!hasCaptcha}
                                data-cy={`testClaimReview${event}`}
                            >
                                {t(`reviewTask:${event}`)}
                            </AletheiaButton>
                        );
                    })}
                </Grid>
            )}

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
