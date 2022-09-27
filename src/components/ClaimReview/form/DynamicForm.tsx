import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import reviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { GlobalStateMachineContext } from "../../../Context/GlobalStateMachineProvider";
import { ReviewTaskEvents } from "../../../machine/enums";
import getNextEvents from "../../../machine/getNextEvent";
import getNextForm from "../../../machine/getNextForm";
import { reviewDataSelector } from "../../../machine/selectors";
import { useAppSelector } from "../../../store/store";
import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "../../Button";
import DynamicInput from "./DynamicInput";

const DynamicForm = ({ sentence_hash, personality, claim, sitekey }) => {
    const {
        handleSubmit,
        control,
        getValues,
        reset,
        formState: { errors },
        watch,
    } = useForm();
    const { machineService } = useContext(GlobalStateMachineContext);
    const initialMachine = machineService.machine.config;
    const reviewData = useSelector(machineService, reviewDataSelector);

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
            const nextForm = getNextForm(param);
            setCurrentForm(nextForm);
            setNextEvents(getNextEvents(param));
        }
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
            setCurrentFormAndNextEvents(initialMachine.initial);
        }
    }, []);

    useEffect(() => {
        reset(reviewData);
        resetIsLoading();
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
        console.log("send data", data);

        //@ts-ignore
        window.umami &&
            //@ts-ignore
            window.umami?.trackEvent(
                `${event}_BUTTON`,
                "Fact-checking workflow"
            );
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
                    {currentForm.map((fieldItem, index) => {
                        const {
                            fieldName,
                            rules,
                            label,
                            placeholder,
                            type,
                            addInputLabel,
                            extraProps,
                        } = fieldItem;

                        const defaultValue = reviewData[fieldName];

                        return (
                            <Row key={index}>
                                <Col span={24}>
                                    <h4
                                        style={{
                                            color: colors.blackSecondary,
                                            fontWeight: 600,
                                            paddingLeft: 10,
                                            marginBottom: 0,
                                        }}
                                    >
                                        {t(label)}
                                    </h4>
                                </Col>
                                <Col span={24} style={{ margin: "10px 0" }}>
                                    <Controller
                                        name={fieldName}
                                        control={control}
                                        rules={rules}
                                        defaultValue={defaultValue}
                                        render={({ field }) => (
                                            <DynamicInput
                                                fieldName={fieldName}
                                                type={type}
                                                placeholder={placeholder}
                                                onChange={field.onChange}
                                                value={field.value}
                                                addInputLabel={addInputLabel}
                                                defaultValue={defaultValue}
                                                data-cy={`testClaimReview${fieldName}`}
                                                extraProps={extraProps}
                                            />
                                        )}
                                    />
                                    {errors[fieldName] && (
                                        <Text
                                            type="danger"
                                            style={{ marginLeft: 20 }}
                                        >
                                            {t(errors[fieldName].message)}
                                        </Text>
                                    )}
                                </Col>
                            </Row>
                        );
                    })}
                    <div
                        style={{
                            paddingBottom: 20,
                            marginLeft: 20,
                        }}
                    >
                        <Text type="danger">
                            {reviewerError &&
                                t("claimReviewTask:invalidReviewerMessage")}
                        </Text>
                    </div>
                    {nextEvents?.length > 0 && (
                        <AletheiaCaptcha
                            onChange={setRecaptchaString}
                            sitekey={sitekey}
                            ref={recaptchaRef}
                        />
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

export default DynamicForm;
