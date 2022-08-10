import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { initialContext } from "../../../machine/context";
import { createNewMachineService } from "../../../machine/reviewTaskMachine";
import {
    ClassificationEnum,
    ReviewTaskEvents,
    ReviewTaskStates,
} from "../../../machine/enums";
import AletheiaButton, { ButtonType } from "../../Button";
import colors from "../../../styles/colors";
import DynamicInput from "../form/DynamicInput";
import unassignedForm from "./unassignedForm";
import assignedForm from "./assignedForm";
import reportedForm from "./reportedForm";
import Text from "antd/lib/typography/Text";
import api from "../../../api/ClaimReviewTaskApi";
import AletheiaCaptcha from "../../AletheiaCaptcha";

const DynamicForm = ({
    sentence_hash,
    personality,
    claim,
    isLoggedIn,
    sitekey,
}) => {
    const {
        handleSubmit,
        control,
        getValues,
        reset,
        formState: { errors },
    } = useForm();
    const [service, setService] = useState(null);
    const [currentForm, setCurrentForm] = useState(null);
    const [nextEvents, setNextEvents] = useState(null);
    const [recaptchaString, setRecaptchaString] = useState("");
    const { t } = useTranslation();
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const setDefaultValuesOfCurrentForm = (machine, form) => {
        if (machine) {
            const machineValues = machine.context.reviewData;
            reset(machineValues);
            form.forEach((input) => {
                Object.keys(machine.context.reviewData).forEach((value) => {
                    if (input.fieldName === value) {
                        input.defaultValue = machine.context.reviewData[value];
                    }
                });
            });
        }
    };

    const setCurrentFormAndNextEvents = (param, machine = null) => {
        if (
            param === ReviewTaskStates.assigned ||
            param === ReviewTaskEvents.assignUser
        ) {
            setDefaultValuesOfCurrentForm(machine, assignedForm);
            setCurrentForm(assignedForm);
            setNextEvents([
                ReviewTaskEvents.goback,
                ReviewTaskEvents.draft,
                ReviewTaskEvents.finishReport,
            ]);
        } else if (
            param === ReviewTaskStates.reported ||
            param === ReviewTaskEvents.finishReport
        ) {
            setDefaultValuesOfCurrentForm(machine, reportedForm);
            setCurrentForm(reportedForm);
            setNextEvents([
                ReviewTaskEvents.goback,
                ReviewTaskEvents.draft,
                ReviewTaskEvents.publish,
            ]);
        } else if (
            param === ReviewTaskStates.published ||
            param === ReviewTaskEvents.publish
        ) {
            setCurrentForm([]);
            setNextEvents([]);
        } else if (param !== ReviewTaskEvents.draft) {
            setDefaultValuesOfCurrentForm(machine, unassignedForm);
            setCurrentForm(unassignedForm);
            setNextEvents([ReviewTaskEvents.assignUser]);
        }
    };

    useEffect(() => {
        isLoggedIn &&
            api
                .getMachineBySentenceHash(sentence_hash, t)
                .then(({ machine }) => {
                    // The states assigned and reported have compound states
                    // and when we going to save we get "assigned: undraft" as a value.
                    // The machine doesn't recognize when we try to persist state the initial value
                    // 'cause the value it's an object. So for these states, we get only the key value
                    if (machine) {
                        machine.value =
                            machine.value !== ReviewTaskStates.published
                                ? Object.keys(machine.value)[0]
                                : machine.value;
                    }

                    const newMachine = machine || {
                        context: initialContext,
                        value: ReviewTaskStates.unassigned,
                    };
                    newMachine.context.utils = { t };
                    setService(createNewMachineService(newMachine));
                    setCurrentFormAndNextEvents(newMachine.value, newMachine);
                });
    }, []);

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

    const sendEventToMachine = (formData, eventName) => {
        service.send(eventName, {
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
