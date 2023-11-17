import AletheiaButton, { ButtonType } from "../../Button";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    reviewingSelector,
    preloadedOptionsSelector,
    reviewDataSelector,
    crossCheckingSelector,
    reportSelector,
} from "../../../machines/reviewTask/selectors";

import AletheiaCaptcha from "../../AletheiaCaptcha";
import { CollaborativeEditorContext } from "../../Collaborative/CollaborativeEditorProvider";
import DynamicForm from "../../Form/DynamicForm";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { Row } from "antd";
import Text from "antd/lib/typography/Text";
import getNextEvents from "../../../machines/reviewTask/getNextEvent";
import getNextForm from "../../../machines/reviewTask/getNextForm";
import {
    isUserLoggedIn,
    currentUserId,
    currentUserRole,
} from "../../../atoms/currentUser";
import reviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { trackUmamiEvent } from "../../../lib/umami";
import { useAppSelector } from "../../../store/store";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useSelector } from "@xstate/react";
import { useTranslation } from "next-i18next";
import WarningModal from "../../Modal/WarningModal";
import { currentNameSpace } from "../../../atoms/namespace";
import { CommentEnum, Roles } from "../../../types/enums";

const DynamicReviewTaskForm = ({ data_hash, personality, claim }) => {
    const {
        handleSubmit,
        control,
        getValues,
        reset,
        formState: { errors },
        watch,
    } = useForm();
    const { machineService } = useContext(ReviewTaskMachineContext);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isReported = useSelector(machineService, reportSelector);
    const { editorContentObject, comments } = useContext(
        CollaborativeEditorContext
    );
    const reviewData = useSelector(machineService, reviewDataSelector);
    const preloadedOptions = useSelector(
        machineService,
        preloadedOptionsSelector
    );

    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [role] = useAtom(currentUserRole);
    const [currentForm, setCurrentForm] = useState(null);
    const [nextEvents, setNextEvents] = useState(null);
    const [isLoading, setIsLoading] = useState({});
    const [reviewerError, setReviewerError] = useState<boolean>(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const [gobackWarningModal, setGobackWarningModal] =
        useState<boolean>(false);
    const [finishReportWarningModal, setFinishReportWarningModal] =
        useState<boolean>(false);
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const { autoSave, enableCollaborativeEdit } = useAppSelector((state) => ({
        autoSave: state.autoSave,
        enableCollaborativeEdit: state?.enableCollaborativeEdit,
    }));

    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);

    const setCurrentFormAndNextEvents = (param, isSameLabel = false) => {
        if (param !== ReviewTaskEvents.draft) {
            let nextForm = getNextForm(
                param,
                enableCollaborativeEdit,
                isSameLabel
            );
            nextForm = setUserPreloads(nextForm);
            setCurrentForm(nextForm);
            setNextEvents(getNextEvents(param, isSameLabel));
        }
    };

    const setUserPreloads = (form) => {
        if (preloadedOptions) {
            form.forEach((item) => {
                if (
                    item.type === "inputSearch" &&
                    preloadedOptions[item.fieldName]
                ) {
                    item.extraProps.preloadedOptions =
                        preloadedOptions[item.fieldName];
                }
            });
        }

        return form;
    };

    const resetIsLoading = () => {
        const isLoading = {};
        nextEvents?.forEach((eventName) => {
            isLoading[eventName] = false;
        });
        setIsLoading(isLoading);
    };

    useEffect(() => {
        if (isLoggedIn) {
            setCurrentFormAndNextEvents(machineService.machine.config.initial);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        reset(reviewData);
        resetIsLoading();
        setReviewerError(false);
    }, [nextEvents]);

    useEffect(() => {
        if (autoSave) {
            let timeout: NodeJS.Timeout;
            watch((value) => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    reviewTaskApi.autoSaveDraft(
                        {
                            data_hash,
                            machine: {
                                context: {
                                    reviewData: value,
                                    claimReview: {
                                        personality,
                                        claim,
                                        isPartialReview: true,
                                    },
                                },
                            },
                        },
                        t
                    );
                }, 10000);
            });
        }
    }, [watch]);

    const sendEventToMachine = (formData, eventName) => {
        setIsLoading((current) => ({ ...current, [eventName]: true }));

        machineService.send(eventName, {
            data_hash,
            reviewData: {
                ...formData,
                reviewComments:
                    comments?.filter(
                        (comment) => comment.type === CommentEnum.review
                    ) || reviewData.reviewComments,
                crossCheckingComments: reviewData.crossCheckingComments,
            },
            claimReview: {
                personality,
                claim,
            },
            type: eventName,
            t,
            recaptchaString,
            setCurrentFormAndNextEvents,
            resetIsLoading,
            currentUserId: userId,
            nameSpace,
        });
        setRecaptchaString("");
        recaptchaRef.current?.resetRecaptcha();
    };

    const ValidateSelectedReviewer = (data, event) => {
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
            sendEventToMachine(
                {
                    ...context,
                    collaborativeEditor: editorContentObject,
                },
                event
            );
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
        if (ValidateSelectedReviewer(data, event)) {
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
            {currentForm && (
                <>
                    <DynamicForm
                        currentForm={currentForm}
                        machineValues={reviewData}
                        control={control}
                        errors={errors}
                    />
                    <div style={{ paddingBottom: 20, marginLeft: 20 }}>
                        {reviewerError && (
                            <Text type="danger" data-cy="testReviewerError">
                                {t("claimReviewTask:invalidReviewerMessage")}
                            </Text>
                        )}
                    </div>
                    {nextEvents?.length > 0 && showButtons && (
                        <AletheiaCaptcha
                            onChange={setRecaptchaString}
                            ref={recaptchaRef}
                        />
                    )}
                </>
            )}
            {showButtons && (
                <Row
                    style={{
                        padding: "32px 0 0",
                        justifyContent: "space-evenly",
                    }}
                >
                    {nextEvents?.map((event) => {
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
                                {t(`claimReviewTask:${event}`)}
                            </AletheiaButton>
                        );
                    })}
                </Row>
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
