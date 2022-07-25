import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { initialContext } from "../../../machine/context";
import { createNewMachineService } from "../../../machine/reviewTaskMachine";
import { ReviewTaskEvents, ReviewTaskStates } from "../../../machine/enums";
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
    const [showSaveDraft, setShowSaveDraft] = useState(true);
    const { t } = useTranslation();
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null);

    const setDefaultValuesOfCurrentForm = (machine, form) => {
        if (machine) {
            const machineValues = machine.context.reviewData
            reset(machineValues)
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
            setNextEvents([ReviewTaskEvents.finishReport]);
            setShowSaveDraft(true);
        } else if (
            param === ReviewTaskStates.reported ||
            param === ReviewTaskEvents.finishReport
        ) {
            setDefaultValuesOfCurrentForm(machine, reportedForm);
            setCurrentForm(reportedForm);
            setNextEvents([ReviewTaskEvents.publish]);
            setShowSaveDraft(true);
        } else if (
            param === ReviewTaskStates.published ||
            param === ReviewTaskEvents.publish
        ) {
            setCurrentForm([]);
            setNextEvents([]);
            setShowSaveDraft(false);
        } else if (param !== ReviewTaskEvents.draft) {
            setCurrentForm(unassignedForm);
            setNextEvents([ReviewTaskEvents.assignUser]);
            setShowSaveDraft(false);
        }
    };

    useEffect(() => {
        isLoggedIn &&
            api
                .getMachineBySentenceHash(sentence_hash, t)
                .then((claimReviewTask) => {
                    const machine = claimReviewTask.machine || {
                        context: initialContext,
                        value: ReviewTaskStates.unassigned,
                    };
                    machine.context.utils = { t };
                    setService(createNewMachineService(machine));
                    setCurrentFormAndNextEvents(machine.value, machine);
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
                inputType,
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
                                    type={type}
                                    placeholder={placeholder}
                                    onChange={field.onChange}
                                    value={field.value}
                                    inputType={inputType}
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

    const onSubmit = async (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute("event");
        sendEventToMachine(data, event);
    };

    const onClickSaveDraft = () => {
        const values = getValues();
        sendEventToMachine(values, ReviewTaskEvents.draft);
    };

    return (
        <>
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
                <Row>
                    {showSaveDraft && (
                        <AletheiaButton
                            type={ButtonType.blue}
                            style={{ margin: 20 }}
                            disabled={!hasCaptcha}
                            onClick={onClickSaveDraft}
                            data-cy={`testClaimReview${ReviewTaskEvents.draft}`}
                        >
                            {t(`claimReviewTask:${ReviewTaskEvents.draft}`)}
                        </AletheiaButton>
                    )}
                    {nextEvents?.map((event) => {
                        return (
                            <AletheiaButton
                                key={event}
                                type={ButtonType.blue}
                                htmlType="submit"
                                event={event}
                                style={{ margin: 20 }}
                                disabled={!hasCaptcha}
                                data-cy={`testClaimReview${event}`}
                            >
                                {t(`claimReviewTask:${event}`)}
                            </AletheiaButton>
                        );
                    })}
                </Row>
            </form>
        </>
    );
};

export default DynamicForm;
