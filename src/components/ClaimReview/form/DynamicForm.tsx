import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Col, Row } from "antd";
import { useTranslation } from 'next-i18next';
import { initialContext } from "../../../machine/context";
import { createNewMachineService } from '../../../machine/reviewTaskMachine';
import { ReviewTaskEvents, ReviewTaskStates } from '../../../machine/enums';
import AletheiaButton, { ButtonType } from "../../Button";
import colors from "../../../styles/colors";
import DynamicInput from "../form/DynamicInput";
import unassignedForm from "./unassignedForm"
import assignedForm from "./assignedForm";
import reportedForm from "./reportedForm";
import Text from "antd/lib/typography/Text";
import api from '../../../api/ClaimReviewTaskApi'
import AletheiaCaptcha from '../../AletheiaCaptcha';

const DynamicForm = ({ sentence_hash, personality, claim, isLoggedIn, sitekey }) => {
    const { handleSubmit, control, formState: { errors } } = useForm()
    const [service, setService] = useState(null);
    const [currentForm, setCurrentForm] = useState(null)
    const { t } = useTranslation()
    const [recaptchaString, setRecaptchaString] = useState('')
    const hasCaptcha = !!recaptchaString;
    const recaptchaRef = useRef(null)

    const setDefaultValuesOfCurrentForm = (machine, form) => {
        machine && form.map((input) => {
            Object.keys(machine.context.reviewData).forEach((value) => {
                if (input.fieldName === value) {
                    input.defaultValue = machine.context.reviewData[value]
                }
            })
        })
    }

    const setCurrentFormBasedOnParam = (param, machine = null) => {
        if(param === ReviewTaskStates.assigned || param === ReviewTaskEvents.assignUser) {
            setDefaultValuesOfCurrentForm(machine, assignedForm)
            setCurrentForm(assignedForm)
        } else if(param === ReviewTaskStates.reported || param === ReviewTaskEvents.finishReport) {
            setDefaultValuesOfCurrentForm(machine, reportedForm)
            setCurrentForm(reportedForm)
        } else if(param === ReviewTaskStates.published || param === ReviewTaskEvents.publish) {
            setCurrentForm([])
        } else if(param !== ReviewTaskEvents.draft) {
            setCurrentForm(unassignedForm)
        }
    }
    
    useEffect(() => {
        isLoggedIn && api.getMachineBySentenceHash(sentence_hash, t).then((claimReviewTask) => {
            const machine = claimReviewTask.machine || { context: initialContext, value: "unassigned" }
            machine.context.utils = { t }
            setService(createNewMachineService(machine))
            setCurrentFormBasedOnParam(machine.value, machine)
        })
    }, []);

    const formInputs = currentForm && currentForm.map((fieldItem, index) => {
        const { fieldName, rules, label, placeholder, type, inputType, addInputLabel, defaultValue } = fieldItem

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

    const onSubmit = async (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute('event')
        service.send(event, {
            sentence_hash,
            reviewData: {
                ...data,
                sentence_hash,
            },
            claimReview: {
                personality,
                claim,
                sentence_hash,
            },
            type: event,
            t,
            recaptchaString
        })
        setCurrentFormBasedOnParam(event)
        recaptchaRef.current.resetRecaptcha()
    };

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {formInputs}
            <AletheiaCaptcha
                onChange={setRecaptchaString}
                sitekey={sitekey}
                ref={recaptchaRef} />
            {service?.state?.nextEvents?.map((event) => {
                return (
                    <AletheiaButton
                        key={event}
                        type={ButtonType.blue}
                        htmlType="submit"
                        event={event}
                        style={{ margin: 20 }}
                        disabled={!hasCaptcha}
                    >
                        {t(`claimReviewTask:${event}`)}
                    </AletheiaButton>
                )
            })}
        </form>)
}

export default DynamicForm;
