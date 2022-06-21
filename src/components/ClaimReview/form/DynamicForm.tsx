import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import DynamicInput from "../form/DynamicInput";
import AletheiaButton, { ButtonType } from "../../Button";
import colors from "../../../styles/colors";
import { Col, Row } from "antd";
import unassignedForm from "./unassignedForm"
import assignedForm from "./assignedForm";
import reportedForm from "./reportedForm";
import { createNewMachineService} from '../../../machine/reviewTaskMachine';
import { useTranslation } from 'next-i18next';
import api from '../../../api/ClaimReviewTaskApi'
import { initialContext } from "../../../machine/context";
import Text from "antd/lib/typography/Text";
const DynamicForm = ({ sentence_hash }) => {
    const { handleSubmit, control, formState: { errors } } = useForm()
    const [ service, setService ] = useState(null);
    const [ currentForm, setCurrentForm ] = useState(null)
    const { t } = useTranslation()

    const setCurrentFormBasedOnParam = (param) => {
        if(param === "assigned" || param === "ASSIGN_USER") {
            setCurrentForm(assignedForm)
        } else if(param === "reported" || param === "FINISH_REPORT") {
            setCurrentForm(reportedForm)
        } else if(param === "published" || param === "PUBLISH") {
            setCurrentForm([])
        } else {
            setCurrentForm(unassignedForm)
        }
    }
    
    useEffect(() => {
        api.getMachineBySentenceHash(sentence_hash, t).then((claimReviewTask) => {
            const machine = claimReviewTask.machine || { context: initialContext, value: "unassigned" }
            machine.context.utils = { t }
            setService(createNewMachineService(machine))
            setCurrentFormBasedOnParam(machine.value)
            // TODO: Add dependencies for the useEffect for when identification values change
        })
    }, []);

    const formInputs = currentForm && currentForm.map((fieldItem, index) => {
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
        service.send(event, { ...data, sentence_hash, type: event, t })
        setCurrentFormBasedOnParam(event)
    };

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {formInputs}
            {service?.state?.nextEvents?.map((event) => {
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
            })}
        </form>)
}

export default DynamicForm;
