import { Form } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaAlert from "../AletheiaAlert";
import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";

const SignUpForm = ({ onFinish, onFinishFailed, isLoading }) => {
    const { t } = useTranslation();

    return (
        <div>
            <AletheiaAlert
                type="info"
                message={
                    <>
                        {t("materials:disclaimerFirstParagraph")} <br />
                        <br />
                        {t("materials:disclaimerSecondParagraph")}{" "}
                        <a href="email:contato@aletheiafact.org">
                            contato@aletheiafact.org
                        </a>
                        .
                    </>
                }
            />
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
                    <InputPassword sx={{ width: "100%" }} />
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
                    <InputPassword sx={{ width: "100%" }} />
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
