import { useSelector } from "@xstate/react";
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
import { reviewDataSelector } from "../../../machine/selectors";
import { useAppSelector } from "../../../store/store";
import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "../../Button";
import { GlobalStateMachineContext } from "../../../Context/GlobalStateMachineProvider";
import DynamicInput from "./DynamicInput";
import { trackUmamiEvent } from "../../../lib/umami";

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
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const { isLoggedIn, autoSave } = useAppSelector((state) => ({
        isLoggedIn: state.login,
        autoSave: state.autoSave,
    }));

    const setDefaultValuesOfCurrentForm = (form) => {
        if (reviewData) {
            reset(reviewData);
            form.forEach((input) => {
                input.defaultValue = reviewData[input.fieldName];
            });
        }
    };

    const setCurrentFormAndNextEvents = (param) => {
        if (param !== ReviewTaskEvents.draft) {
            const nextForm = getNextForm(param);
            setCurrentForm(nextForm);
            setDefaultValuesOfCurrentForm(nextForm);
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
        resetIsLoading();
    }, [nextEvents]);

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

    const validateClassification = (data) => {
        return (
            !data.classification ||
            Object.values(ClassificationEnum).includes(data.classification)
        );
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
        if (validateClassification(data)) {
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
