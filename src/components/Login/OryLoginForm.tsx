import {
    SelfServiceLoginFlow,
    SubmitSelfServiceLoginFlowBody,
    SubmitSelfServiceLoginFlowWithPasswordMethodBody as ValuesType,
    SubmitSelfServiceSettingsFlowWithTotpMethodBody as TotpValuesType,
} from "@ory/client";
import { Alert, Form, message, Row } from "antd";
import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { oryGetLoginFlow, orySubmitLogin } from "../../api/ory";
import { ory } from "../../lib/orysdk";
import { handleFlowError } from "../../lib/orysdk/errors";
import { getUiNode } from "../../lib/orysdk/utils";
import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import Loading from "../Loading";

const OryLoginForm = () => {
    const [flow, setFlow] = useState<SelfServiceLoginFlow>();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        oryGetLoginFlow({ router, setFlow, t });
    }, []);

    const onSubmit = (values: SubmitSelfServiceLoginFlowBody) => {
        orySubmitLogin({ router, flow, setFlow, t, values }).then(() => {
            setIsLoading(false);
        });
    };

    const onSubmitTotp = (values: SubmitSelfServiceLoginFlowBody) =>
        ory
            .submitSelfServiceLoginFlow(String(flow?.id), undefined, values)
            // We logged in successfully! Let's bring the user home.
            .then(() => {
                if (flow?.return_to) {
                    window.location.href = flow?.return_to;
                    return;
                }
                router.push("/");
            })
            .catch(handleFlowError(router, "login", setFlow, t))
            .catch((err: AxiosError) => {
                // If the previous handler did not catch the error it's most likely a form validation error
                if (err.response?.status === 400) {
                    // Yup, it is!
                    setFlow(err.response?.data);
                    return message.error(t("profile:totpIncorectCodeMessage"));
                }

                return Promise.reject(err);
            });

    if (!flow) {
        return <Loading />;
    }

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
        password_identifier: "",
        identifier: "",
    };

    let totpValues: TotpValuesType = {
        csrf_token: "",
        method: "totp",
        totp_code: "",
    };

    const initializeCsrf = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            flowValues.csrf_token = csrfNode.value;
        }
    };

    const initializeCsrfTotp = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            totpValues.csrf_token = csrfNode.value;
        }
    };

    const onFinish = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            const { password, email } = values;
            initializeCsrf();
            flowValues = {
                ...flowValues,
                password,
                password_identifier: email,
            };
            onSubmit(flowValues);
        }
    };

    const onFinishTotp = (values) => {
        initializeCsrfTotp();
        totpValues = {
            ...totpValues,
            totp_code: values.totp,
        };
        onSubmitTotp(totpValues);
    };

    const onFinishFailed = (errorInfo) => {
        if (typeof errorInfo === "string") {
            message.error(errorInfo);
        } else {
            message.error(t("login:loginFailedMessage"));
        }
    };

    return (
        <>
            {flow.refresh && (
                <Row style={{ paddingBottom: "10px" }}>
                    <Alert
                        message={t("login:refreshLoginMessage")}
                        type="warning"
                    />
                </Row>
            )}
            {flow?.requested_aal !== "aal2" && (
                <>
                    <Row className="typo-grey typo-center">
                        <h2>{t("login:formHeader")}</h2>
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
                                <Button
                                    loading={isLoading}
                                    type={ButtonType.blue}
                                    htmlType="submit"
                                    data-cy={"loginButton"}
                                >
                                    {t("login:submitButton")}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </>
            )}
            {flow?.requested_aal === "aal2" && (
                <>
                    <Row>
                        <h2>{t("totp:formHeader")}</h2>
                    </Row>
                    <p>{t("totp:totpMessage")}</p>
                    <Form name="basic" onFinish={onFinishTotp}>
                        <Form.Item
                            label={t("totp:inputLabel")}
                            name="totp"
                            rules={[
                                {
                                    required: true,
                                    message: t("totp:totpErrorMessage"),
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
                                <Button
                                    loading={isLoading}
                                    type={ButtonType.blue}
                                    htmlType="submit"
                                >
                                    {t("totp:submitButton")}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </>
            )}
        </>
    );
};

export default OryLoginForm;
