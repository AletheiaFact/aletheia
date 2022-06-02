import React from 'react'
import { useMachine } from "@xstate/react";
import { reviewTaskMachine } from "../../machine/reviewTaskMachine"
import { useTranslation } from 'next-i18next';
import { useForm, Controller } from "react-hook-form";
import DynamicInput from './form/DynamicInput';
import AletheiaButton, { ButtonType } from '../Button';
import api from '../../api/claimReviewTask'
import colors from '../../styles/colors';
import { Col, Row } from 'antd';

const DynamicForm = ({ sentence_hash }) => {
    const [state, send] = useMachine(reviewTaskMachine)
    const { t } = useTranslation();

    const { handleSubmit, control, formState: { errors } } = useForm()

    const currentForm = state.context.formUi

    const formInputs = Object.keys(currentForm).map(fieldName => {
        const { rules, defaultValue, label, placeholder, type, ruleType } = currentForm[fieldName];
        if (type !== 'sendEvent') {
            return (
                <Row key={fieldName}>
                    <Col span={24}>
                        <h4
                            style={{
                                color: colors.blackSecondary,
                                fontWeight: 600,
                                paddingLeft: 10,
                                marginBottom: 0,
                            }}
                        >
                            {label}
                        </h4>
                    </Col>
                    <Col span={24} style={{ margin: "10px 0", }}>
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
                                    sentenceHash={sentence_hash}
                                    ruleType={ruleType}
                                />
                            )}
                        />
                        {errors[fieldName] && <p>This field is required</p>}
                    </Col>
                </Row>
            )
        }
        return null
    })

    const onSubmit = (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute('event')
        send(event, { ...data, sentence_hash, t })
        switch (event) {
            case "ASSIGN_USER":
                api.createClaimReviewTask({ sentence_hash, machine: state }, t)
                break;
            case "REPORT_FINISHED":
                api.updateClaimReviewTask({ sentence_hash, machine: JSON.stringify(state) }, t)
                break;
            case "PUBLISHED":
                api.updateClaimReviewTask({ sentence_hash, machine: JSON.stringify(state) }, t)
                break;
        }
    };

    return (
        <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(onSubmit)}
        >
            {formInputs}
            {state.nextEvents.map((event) => {
                return (
                    <AletheiaButton
                        key={event}
                        type={ButtonType.blue}
                        htmlType="submit"
                        event={event}
                        style={{ marginTop: 20, marginBottom: 20 }}
                    >
                        {event}
                    </AletheiaButton>
                )
            })
            }

        </form>)
}

export default DynamicForm
