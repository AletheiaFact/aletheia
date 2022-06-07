import React, { useEffect, useState } from "react";
import { Alert, Form, message, Row } from "antd";
import InputPassword from "../InputPassword";
import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import {
    SelfServiceLoginFlow,
    SubmitSelfServiceLoginFlowBody,
    SubmitSelfServiceLoginFlowWithPasswordMethodBody as ValuesType,
    UiNodeInputAttributes
} from "@ory/client";
import { isUiNodeInputAttributes } from "@ory/integrations/ui"
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
    oryGetLoginFlow,
    orySubmitLogin
} from "../../api/ory";
import { LoadingOutlined } from "@ant-design/icons";

const OryLoginForm = () => {
    const [flow, setFlow] = useState<SelfServiceLoginFlow>()
    const { t } = useTranslation()
    const router = useRouter()

    useEffect(() => {
        oryGetLoginFlow({ router, setFlow, t })
    }, [])

    const onSubmit = (values: SubmitSelfServiceLoginFlowBody) => {
        orySubmitLogin({ router, flow, setFlow, t, values })
    }

    if (!flow) {
        return <LoadingOutlined />
    }

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
        password_identifier: "",
        identifier: ""
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
            password_identifier: email
        }
        onSubmit(flowValues)
    }

    const onFinishFailed = errorInfo => {
        if (typeof errorInfo === "string") {
            message.error(errorInfo);
        } else {
            message.error(t("login:loginFailedMessage"));
        }
    };

    return (
        <>
            <Row className="typo-grey typo-center">
                <h2>{t("login:formHeader")}</h2>
            </Row>
            {flow.refresh && <Row style={{ paddingBottom: "10px" }}>
                <Alert
                    message={t("login:refreshLoginMessage")}
                    type="warning"
                />
            </Row>}
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

export default OryLoginForm;
