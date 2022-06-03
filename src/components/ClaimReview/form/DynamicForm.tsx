import React from 'react'
import { useMachine } from "@xstate/react";
import { reviewTaskMachine } from "../../../machine/reviewTaskMachine"
import { useTranslation } from 'next-i18next';
import { useForm, Controller } from "react-hook-form";
import DynamicInput from './DynamicInput';
import AletheiaButton, { ButtonType } from '../../Button';
import api from '../../../api/claimReviewTask'
import { ReviewTaskStates, ReviewTaskEvents } from '../../../machine/enums';


const DynamicForm = ({ sentence_hash }) => {
    const [state, send] = useMachine(reviewTaskMachine)
    const { t } = useTranslation();

    const { handleSubmit, control, formState: { errors } } = useForm()

    const currentForm = state.context.formUi

    const formInputs = Object.keys(currentForm).map(fieldName => {
        const { rules, defaultValue, label, placeholder, type } = currentForm[fieldName];

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
                        />
                    )}
                />
                {errors[fieldName] && <p>This field is required</p>}
            </div>
        )
    })

    const onSubmit = (data, e) => {
        const event = e.nativeEvent.submitter.getAttribute('key')
        console.log(data, event)
        switch (event) {
            case ReviewTaskEvents.assignUser:
                api.createClaimReviewTask({ sentence_hash, context: data, state: ReviewTaskStates.assigned }, t)
                break;
            case ReviewTaskEvents.finishReport:
                api.updateClaimReviewTask({ sentence_hash, context: data, state: ReviewTaskStates.reported }, t)
                break;
            case ReviewTaskEvents.publish:
                api.updateClaimReviewTask({ sentence_hash, context: data, state: ReviewTaskStates.published }, t)
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
