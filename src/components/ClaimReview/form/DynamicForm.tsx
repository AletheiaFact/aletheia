import React from "react";
import { useForm, Controller } from "react-hook-form";
import DynamicInput from "../form/DynamicInput";
import AletheiaButton, { ButtonType } from "../../Button";
import colors from "../../../styles/colors";
import { Col, Row } from "antd";
import assignedForm from "./assignedForm";
import reportedForm from "./reportedForm";
import { ReviewTaskEvents } from "../../../machine/enums";
import { authService } from "../../../machine/reviewTaskMachine";
import { useActor } from "@xstate/react";
import { useTranslation } from "next-i18next";
import Text from "antd/lib/typography/Text";
import { FormField } from "./FormField";

const DynamicForm = ({ sentence_hash }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [authState] = useActor(authService);
    const { t } = useTranslation();

    const currentForm = authState.context.formUi;

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

    const onSubmit = async (data, e) => {
        let formUi: FormField[];
        const event = e.nativeEvent.submitter.getAttribute("event");
        if (event === ReviewTaskEvents.assignUser) {
            formUi = assignedForm;
        } else if (event === ReviewTaskEvents.finishReport) {
            formUi = reportedForm;
        } else {
            formUi = [];
        }
        authService.send(event, {
            ...data,
            sentence_hash,
            type: event,
            formUi,
            t,
        });
    };

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            {formInputs}
            {authState.nextEvents.map((event) => {
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
                );
            })}
        </form>
    );
};

export default DynamicForm;
