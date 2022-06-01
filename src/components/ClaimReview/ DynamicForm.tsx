import React from 'react'
import { useMachine } from "@xstate/react";
import { reviewTaskMachine } from "../../machine/reviewTaskMachine"
import { useTranslation } from 'next-i18next';
import { useForm, Controller } from "react-hook-form";
import DynamicInput from './form/DynamicInput';
import AletheiaButton, { ButtonType } from '../Button';
import api from '../../api/claimReviewTask'


const DynamicForm = ({ sentence_hash }) => {
    const [state, send] = useMachine(reviewTaskMachine)
    const { t } = useTranslation();

    const { handleSubmit, control, formState: { errors } } = useForm()

    const currentForm = state.context.formUi

    const formInputs = Object.keys(currentForm).map(fieldName => {
        const { rules, defaultValue, label, placeholder, type } = currentForm[fieldName];
        if (type !== 'sendEvent') {
            return (
                <div key={fieldName}>
                    <label>{label}</label>
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
                            />
                        )}
                    />
                    {errors[fieldName] && <p>This field is required</p>}

                </div>
            )
        }
        return null
    })

    const onSubmit = (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute('event')
        console.log(data, event)
        switch (event) {
            case "ASSIGN_USER":
                api.createClaimReviewTask({ sentence_hash, context: data, state: 'assigned' }, t)
                break;
            case "REPORT_FINISHED":
                api.updateClaimReviewTask({ sentence_hash, context: data, state: 'reported' }, t)
                break;
            case "PUBLISHED":
                api.updateClaimReviewTask({ sentence_hash, context: data, state: 'published' }, t)
                break;
        }

        send(event, { ...data, sentence_hash, t })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
