import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import DynamicInput from '../form/DynamicInput';
import AletheiaButton, { ButtonType } from '../../Button';
import colors from '../../../styles/colors';
import { Col, Row } from 'antd';
import unassignedForm from "./unassignedForm"
import assignedForm from "./assignedForm";
import reportedForm from "./reportedForm";
import { reviewTaskMachine, reviewTaskService } from '../../../machine/reviewTaskMachine';
import { useTranslation } from 'next-i18next';
import { State } from 'xstate';
import api from '../../../api/ClaimReviewTaskApi'

const DynamicForm = ({ sentence_hash }) => {
    const { handleSubmit, control, formState: { errors } } = useForm()
    const [ service, setService ] = useState(reviewTaskService);
    const [ currentForm, setCurrentForm ] = useState(unassignedForm)
    const [ nextEvent, setNextEvent ] = useState("ASSIGN_USER");
    const { t } = useTranslation()
    
    useEffect(() => {
        // TODO: Add the fetch to get the stored state from the server
        api.getMachineBySentenceHash(sentence_hash).then((machine) => {
            console.log("machine", machine)
            if(machine) {
                const persitedReviewTaskMachine = machine.machine
                const previousState = State.create(persitedReviewTaskMachine);
                // @ts-ignore
                const resolvedState = reviewTaskMachine.resolveState(previousState);
                switch (resolvedState.value) {
                    case "assigned":
                        //@ts-ignore
                        setCurrentForm(assignedForm)
                        break;
                    case "reported":
                        //@ts-ignore
                        setCurrentForm(reportedForm)
                        break;
                    case "published":
                        //@ts-ignore
                        setCurrentForm({})
                        break;
                }
                switch (resolvedState.value) {
                    case "assigned":
                        setNextEvent("FINISH_REPORT")
                        break;
                    case "reported":
                        setNextEvent("PUBLISH")
                        break;
                }
                //@ts-ignore
                setService(resolvedState);
                // TODO: Add dependencies for the useEffect for when identification values change
            }
        })
    }, []);

    const formInputs = currentForm.map((fieldItem, index) => {
        const { fieldName, rules, label, placeholder, type, inputType, addInputLabel } = fieldItem

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
                        render={({ field }) => (
                            <DynamicInput
                                type={type}
                                placeholder={placeholder}
                                onChange={field.onChange}
                                value={field.value}
                                inputType={inputType}
                                addInputLabel={addInputLabel}
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

    const onSubmit = async(data, e) => {
        const event = e.nativeEvent.submitter.getAttribute('event')
        reviewTaskService.send(event, { ...data, sentence_hash, type: event, t })
        switch (event) {
            case "ASSIGN_USER":
                //@ts-ignore
                setNextEvent("FINISH_REPORT")
                break;
            case "FINISH_REPORT":
                //@ts-ignore
                setNextEvent("PUBLISH")
                break;
        }
        switch (event) {
            case "ASSIGN_USER":
                //@ts-ignore
                setCurrentForm(assignedForm)
                break;
            case "FINISH_REPORT":
                //@ts-ignore
                setCurrentForm(reportedForm)
                break;
            case "PUBLISH":
                //@ts-ignore
                setCurrentForm({})
                break;
        }
        console.log(event)
    };

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {formInputs}
            {/* {service.state.nextEvents.map((event) => {
                return (
                    <AletheiaButton
                        key={event}
                        type={ButtonType.blue}
                        htmlType="submit"
                        event={event}
                        style={{ marginBottom: 20 }}
                    >
                        {t(`claimReviewTask:${event}`)}
                    </AletheiaButton>
                )
            })
            } */}
            <AletheiaButton
                key={nextEvent}
                type={ButtonType.blue}
                htmlType="submit"
                event={nextEvent}
                style={{ marginTop: 20, marginBottom: 20 }}
            >
                {nextEvent}
            </AletheiaButton>

        </form>)
}

export default DynamicForm;
