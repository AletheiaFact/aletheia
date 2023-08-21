import AletheiaButton, { ButtonType } from "../../Button";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    preloadedOptionsSelector,
    reviewDataSelector,
} from "../../../machines/reviewTask/selectors";

import AletheiaCaptcha from "../../AletheiaCaptcha";
import { CollaborativeEditorContext } from "../../Collaborative/CollaborativeEditorProvider";
import DynamicForm from "../../Form/DynamicForm";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { Row } from "antd";
import Text from "antd/lib/typography/Text";
import getEditorSources from "../../Collaborative/utils/getEditorSources";
import getNextEvents from "../../../machines/reviewTask/getNextEvent";
import getNextForm from "../../../machines/reviewTask/getNextForm";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import replaceHrefReferenceWithHash from "../../Collaborative/utils/replaceHrefReferenceWithHash";
import reviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { trackUmamiEvent } from "../../../lib/umami";
import { useAppSelector } from "../../../store/store";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useSelector } from "@xstate/react";
import { useTranslation } from "next-i18next";
import WarningModal from "../../Modal/WarningModal";

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
    const { editorContent, setEditorError } = useContext(
        CollaborativeEditorContext
    );
    const reviewData = useSelector(machineService, reviewDataSelector);
    const preloadedOptions = useSelector(
        machineService,
        preloadedOptionsSelector
    );

    const { t } = useTranslation();

    const [currentForm, setCurrentForm] = useState(null);
    const [nextEvents, setNextEvents] = useState(null);
    const [isLoading, setIsLoading] = useState({});
    const [reviewerError, setReviewerError] = useState<boolean>(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const [gobackWarningModal, setGobackWarningModal] =
        useState<boolean>(false);
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const { autoSave, enableCollaborativeEdit } = useAppSelector((state) => ({
        autoSave: state.autoSave,
        enableCollaborativeEdit: state?.enableCollaborativeEdit,
    }));

    const [isLoggedIn] = useAtom(isUserLoggedIn);

    const setCurrentFormAndNextEvents = (param) => {
        if (param !== ReviewTaskEvents.draft) {
            let nextForm = getNextForm(param, enableCollaborativeEdit);
            nextForm = setUserPreloads(nextForm);
            setCurrentForm(nextForm);
            setNextEvents(getNextEvents(param));
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
        });
        setRecaptchaString("");
        recaptchaRef.current?.resetRecaptcha();
    };

    const ValidateSelectedReviewer = (data) => {
        const isValidReviewer =
            !data.reviewerId || !reviewData.usersId.includes(data.reviewerId);
        setReviewerError(!isValidReviewer);
        return isValidReviewer;
    };

    const handleSendEvent = async (event, data = null) => {
        if (!data) data = getValues();

        if (
            enableCollaborativeEdit &&
            editorContent &&
            nextEvents.includes("FULL_REVIEW")
        ) {
            setEditorError(null);

            if (!editorContent.html.includes(`<a href="http`)) {
                return setEditorError(t("sourceForm:errorMessageNoURL"));
            }

            data.summary = replaceHrefReferenceWithHash(editorContent.html);
            data.sources = getEditorSources(editorContent.JSON.content);
        }
        sendEventToMachine(data, event);
    };

    /**
     * Send event to machine validating form rules
     * @param data data from form submit
     * @param e event
     */
    const onSubmit = async (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute("event");
        if (ValidateSelectedReviewer(data)) {
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
                    {nextEvents?.length > 0 && (
                        <AletheiaCaptcha
                            onChange={setRecaptchaString}
                            ref={recaptchaRef}
                        />
                    )}
                </>
            )}
            <Row
                style={{ padding: "32px 0 0", justifyContent: "space-evenly" }}
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

            <WarningModal
                visible={gobackWarningModal}
                title={t("warningModal:title", {
                    warning: t("warningModal:gobackWarning"),
                })}
                width={400}
                handleOk={() => {
                    handleSendEvent(ReviewTaskEvents.goback);
                    setGobackWarningModal(!gobackWarningModal);
                }}
                handleCancel={() => setGobackWarningModal(!gobackWarningModal)}
                style={{
                    position: "relative",
                    top: "calc(50% - 156px)",
                    right: "-20%",
                }}
            />
        </form>
    );
};

export default DynamicReviewTaskForm;
