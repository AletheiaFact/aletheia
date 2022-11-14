import { Alert, Form, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";

const OryLoginForm = ({
    flow,
    onFinish,
    onFinishFailed,
    isLoading,
    onFinishTotp,
}) => {
    const { t } = useTranslation();

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
