import {
    SelfServiceLoginFlow,
    SubmitSelfServiceLoginFlowBody,
    SubmitSelfServiceLoginFlowWithPasswordMethodBody as ValuesType,
} from "@ory/client";
import { Form, message } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { oryGetLoginFlow, orySubmitLogin } from "../../api/ory";
import userApi from "../../api/userApi";
import { getUiNode } from "../../lib/orysdk/utils";

import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";

const SignUpForm = () => {
    const { t } = useTranslation();
    const [flow, setFlow] = useState<SelfServiceLoginFlow>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
        password_identifier: "",
        identifier: "",
    };

    useEffect(() => {
        oryGetLoginFlow({ router, setFlow, t });
    }, []);

    const onFinish = (values: any) => {
        const { password, email, name } = values;
        setIsLoading(true);
        const payload = {
            email,
            password,
            name,
        };
        userApi.register(payload, t).then((res) => {
            if (!res?.error) {
                initializeCsrf();
                flowValues = {
                    ...flowValues,
                    password,
                    password_identifier: email,
                };
                submitLogin(flowValues);
            }
            setIsLoading(false);
        });
    };

    const onFinishFailed = (errorInfo) => {
        if (typeof errorInfo === "string") {
            message.error(errorInfo);
        }
        setIsLoading(false);
    };

    const initializeCsrf = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            flowValues.csrf_token = csrfNode.value;
        }
    };

    const submitLogin = (values: SubmitSelfServiceLoginFlowBody) => {
        orySubmitLogin({ router, flow, setFlow, t, values }).then(() => {
            setIsLoading(false);
        });
    };

    return (
        <div>
            <h2>{t("login:signupFormHeader")}</h2>
            <Form
                name="signUp"
                wrapperCol={{ span: 18 }}
                labelCol={{ span: 6 }}
                labelAlign="left"
                labelWrap
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label={t("login:nameLabel")}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: t("login:nameErrorMessage"),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("login:emailLabel")}
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: t("login:emailErrorMessage"),
                        },
                        {
                            type: "email",
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
                <Form.Item
                    name="repeatPassword"
                    label={t("login:repeatPasswordLabel")}
                    rules={[
                        {
                            required: true,
                            message: t("common:requiredFieldError"),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        t("profile:passwordMatchErrorMessage")
                                    )
                                );
                            },
                        }),
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                    }}
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
        </div>
    );
};

export default SignUpForm;
