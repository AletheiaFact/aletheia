import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import reviewTaskApi from "../../../api/ClaimReviewTaskApi";
import usersApi from "../../../api/user";
import { ClassificationEnum, ReviewTaskEvents } from "../../../machine/enums";
import getNextEvents from "../../../machine/getNextEvent";
import getNextForm from "../../../machine/getNextForm";
import { useAppSelector } from "../../../store/store";
import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "../../Button";
import { GlobalStateMachineContext } from "../Context/GlobalStateMachineProvider";
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

    const [currentForm, setCurrentForm] = useState(null);
    const [nextEvents, setNextEvents] = useState(null);
    const { t } = useTranslation();
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isLoadingGoBack, setIsLoadingGoBack] = useState(false);
    const [isLoadingDraft, setIsLoadingDraft] = useState(false);

    const { isLoggedIn, autoSave } = useAppSelector((state) => ({
        isLoggedIn: state.login,
        autoSave: state.autoSave,
    }));

    useEffect(() => {
        if (isLoggedIn) {
            setCurrentFormAndNextEvents(initialMachine.initial);
        }
    }, []);

    const setDefaultValuesOfCurrentForm = (form) => {
        const machineValues = initialMachine.context.reviewData;
        if (machineValues) {
            reset(machineValues);
            form.forEach((input) => {
                input.defaultValue = machineValues[input.fieldName];
            });
        }
    };

    const setCurrentFormAndNextEvents = (param) => {
        const nextForm = getNextForm(param);
        setCurrentForm(nextForm);
        setDefaultValuesOfCurrentForm(nextForm);
        setNextEvents(getNextEvents(param));
    };

    const isButtonLoading = (eventName) => {
        if (eventName === ReviewTaskEvents.goback) {
            return isLoadingGoBack;
        }
        return eventName === ReviewTaskEvents.draft
            ? isLoadingDraft
            : isLoadingSubmit;
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        autoSave &&
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
    }, [watch]);

    const fetchUserList = async (name) => {
        const userSearchResults = await usersApi.getUsers(name, t);
        return userSearchResults.map((user) => ({
            label: user.name,
            value: user._id,
        }));
    };

    const formInputs =
        currentForm &&
        currentForm.map((fieldItem, index) => {
            const {
                fieldName,
                rules,
                label,
                placeholder,
                type,
                addInputLabel,
                defaultValue,
            } = fieldItem;

            return (
                <Row key={index} style={{ marginBottom: 20 }}>
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
                                    dataLoader={fetchUserList}
                                />
                            )}
                        />
                        {errors[fieldName] && (
                            <Text type="danger" style={{ marginLeft: 20 }}>
                                {t(errors[fieldName].message)}
                            </Text>
                        )}
                    </Col>
                </Row>
            );
        });

    const buttonLoading = (eventName) => {
        if (eventName === ReviewTaskEvents.draft) {
            return setIsLoadingDraft;
        }
        return eventName === ReviewTaskEvents.goback
            ? setIsLoadingGoBack
            : setIsLoadingSubmit;
    };

    const sendEventToMachine = (formData, eventName) => {
        const setIsLoading = buttonLoading(eventName);
        setIsLoading(true);

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
            setIsLoading,
        });
        setRecaptchaString("");
        recaptchaRef.current?.resetRecaptcha();
    };

    /**
     * Verify if classification exists and is a valid type
     * Send Event and data to state machine
     * Reset recaptcha
     * @param data data from form
     * @param e event
     */
    const onSubmit = async (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute("event");
        if (
            data?.classification &&
            Object.values(ClassificationEnum).includes(data.classification)
        ) {
            sendEventToMachine(data, event);
        } else if (!data?.classification) {
            sendEventToMachine(data, event);
        }
    };

    const onClickSaveDraft = () => {
        const values = getValues();
        //@ts-ignore
        umami?.trackEvent(
            `${ReviewTaskEvents.draft}_BUTTON`,
            "Fact-checking workflow"
        );
        sendEventToMachine(values, ReviewTaskEvents.draft);
    };

    const onClickGoBack = () => {
        //@ts-ignore
        umami?.trackEvent(
            `${ReviewTaskEvents.goback}_BUTTON`,
            "Fact-checking workflow"
        );
        sendEventToMachine({}, ReviewTaskEvents.goback);
    };

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {formInputs && (
                <>
                    {formInputs}
                    {currentForm?.length > 0 && (
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
                            loading={isButtonLoading(event)}
                            key={event}
                            type={ButtonType.blue}
                            htmlType={
                                event === ReviewTaskEvents.goback ||
                                event === ReviewTaskEvents.draft
                                    ? "button"
                                    : "submit"
                            }
                            onClick={
                                event === ReviewTaskEvents.goback
                                    ? onClickGoBack
                                    : event === ReviewTaskEvents.draft
                                    ? onClickSaveDraft
                                    : () => {
                                          //@ts-ignore
                                          umami?.trackEvent(
                                              `${event}_BUTTON`,
                                              "Fact-checking workflow"
                                          );
                                      }
                            }
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
