import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import reviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { ReviewTaskMachineContext } from "../../../Context/ReviewTaskMachineProvider";
import { ReviewTaskEvents } from "../../../machines/reviewTask/enums";
import getNextEvents from "../../../machines/reviewTask/getNextEvent";
import getNextForm from "../../../machines/reviewTask/getNextForm";
import {
    preloadedOptionsSelector,
    reviewDataSelector,
} from "../../../machines/reviewTask/selectors";
import { useAppSelector } from "../../../store/store";
import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "../../Button";
import DynamicInput from "../../Form/DynamicInput";
import { trackUmamiEvent } from "../../../lib/umami";
import DynamicForm from "../../Form/DynamicForm";

const DynamicReviewTaskForm = ({ sentence_hash, personality, claim }) => {
    const {
        handleSubmit,
        control,
        getValues,
        reset,
        formState: { errors },
        watch,
    } = useForm();
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const preloadedOptions = useSelector(
        machineService,
        preloadedOptionsSelector
    );

    const { t } = useTranslation();

    const [currentForm, setCurrentForm] = useState(null);
    const [nextEvents, setNextEvents] = useState(null);
    const [isLoading, setIsLoading] = useState({});
    const [reviewerError, setReviewerError] = useState(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const { isLoggedIn, autoSave } = useAppSelector((state) => ({
        isLoggedIn: state.login,
        autoSave: state.autoSave,
    }));

    const setCurrentFormAndNextEvents = (param) => {
        if (param !== ReviewTaskEvents.draft) {
            let nextForm = getNextForm(param);
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
    }, []);

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
                            sentence_hash,
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
            sentence_hash,
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
        if (!data) {
            data = getValues();
        }

        trackUmamiEvent(`${event}_BUTTON`, "Fact-checking workflow");
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
                    <div
                        style={{
                            paddingBottom: 20,
                            marginLeft: 20,
                        }}
                    >
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
                    {!recaptchaString && (
                        <h1
                            style={{
                                color: "red",
                                fontSize: "14px",
                                fontFamily: "sans-serif",
                            }}
                        >
                            {t("common:requiredFieldError")}
                        </h1>
                    )}
                </>
            )}
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
                            htmlType={
                                event === ReviewTaskEvents.goback ||
                                event === ReviewTaskEvents.draft
                                    ? "button"
                                    : "submit"
                            }
                            onClick={() => {
                                if (
                                    event === ReviewTaskEvents.goback ||
                                    event === ReviewTaskEvents.draft
                                )
                                    handleSendEvent(event);
                            }}
                            event={event}
                            disabled={
                                event === ReviewTaskEvents.goback
                                    ? false
                                    : !hasCaptcha
                            }
                            data-cy={`testClaimReview${event}`}
                        >
                            {t(`claimReviewTask:${event}`)}
                        </AletheiaButton>
                    );
                })}
            </Row>
        </form>
    );
};

export default DynamicReviewTaskForm;
