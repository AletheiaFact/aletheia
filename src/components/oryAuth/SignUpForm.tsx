import React from "react";
import { Form, message, Row } from "antd";
import InputPassword from "../InputPassword";
import Input from "../Input";
import Button, { ButtonType } from "../Button";
import {
    SelfServiceRegistrationFlow,
    SubmitSelfServiceRegistrationFlowWithPasswordMethodBody as ValuesType,
    UiNodeInputAttributes
} from "@ory/client";
import { isUiNodeInputAttributes } from "@ory/integrations/ui"
import { useTranslation } from "next-i18next";

interface ISignUpForm {
    flow?: SelfServiceRegistrationFlow
    onSubmit: (values: ValuesType) => void
}

const SignUpForm = ({ flow, onSubmit }: ISignUpForm) => {
    const { t } = useTranslation()
    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
        traits: { email: '' }
    }

    const initializeCsrf = () => {
        if (flow?.ui?.nodes) {
            const { nodes } = flow?.ui
            const csrfNode = nodes.find(
                node =>
                    isUiNodeInputAttributes(node.attributes) &&
                    node.attributes.name === "csrf_token"
            ).attributes as UiNodeInputAttributes
            if (csrfNode) {
                flowValues.csrf_token = csrfNode.value
            }
        }
    }

    const onFinish = (values) => {
        const { password, email } = values
        initializeCsrf()
        flowValues = {
            ...flowValues,
            password,
            traits: { email }
        }
        onSubmit(flowValues)
    }

    const onFinishFailed = errorInfo => {
        if (typeof errorInfo === "string") {
            message.error(errorInfo);
        } else {
            message.error(t("login:signupFailedMessage"));
        }
    };

    return (
        <>
            <Row className="typo-grey typo-center">
                <h2>{t('login:signupFormHeader')}</h2>
            </Row>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label={t("login:emailLabel")}
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: t("login:emailErrorMessage"),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("login:passwordLabel")}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: t("login:passwordErrorMessage"),
                        },
                    ]}
                >
                    <InputPassword />
                </Form.Item>
                <Form.Item>
                    <div
                        style={{
                            justifyContent: "space-between",
                            display: "flex",
                        }}
                    >
                        <Button type={ButtonType.blue} htmlType="submit">
                            {t("login:submitButton")}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
};

export default SignUpForm;
