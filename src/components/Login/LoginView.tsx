import React, { useState } from "react";
import { Form, Row, Col, Card, message } from "antd";
import api from "../../api/user";
import BackButton from "../BackButton";
import CTARegistration from "../Home/CTARegistration";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import InputPassword from "../InputPassword";
import Input from "../Input";
import Button, { ButtonType } from "../Button";
import colors from "../../styles/colors";

const LoginView = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const [formType, setFormType] = useState("login");

    const onFinishFailed = errorInfo => {
        if (typeof errorInfo === "string") {
            message.error(errorInfo);
        } else {
            message.error(t("login:loginFailedMessage"));
        }
    };

    const onFinish = async values => {
        const result = await api.login(values, t);

        if (!result.login) {
            onFinishFailed(result.message);
        } else {
            message.success(t("login:loginSuccessfulMessage"));
            router.back();
        }
    };

    return (
        <>
            <Row justify="center">
                <Col span={24}>
                    <Card
                        style={{
                            marginTop: 45,
                            ...(formType === "signup" && {
                                backgroundColor: colors.bluePrimary
                            })
                        }}
                    >
                        {formType === "login" && (
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
                                                message: t(
                                                    "login:emailErrorMessage"
                                                )
                                            }
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
                                                message: t(
                                                    "login:passwordErrorMessage"
                                                )
                                            }
                                        ]}
                                    >
                                        <InputPassword />
                                    </Form.Item>
                                    <Form.Item>
                                        <div
                                            style={{
                                                justifyContent:
                                                    "space-between",
                                                display: "flex"
                                            }}
                                        >
                                            <a
                                                onClick={() => {
                                                    setFormType("signup");
                                                }}
                                                style={{
                                                    color: colors.bluePrimary
                                                }}
                                            >
                                                {t("login:signup")}
                                            </a>
                                            <Button
                                                type={ButtonType.blue}
                                                htmlType="submit"
                                            >
                                                {t("login:submitButton")}
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </>
                        )}
                        {formType === "signup" && (
                            <>
                                <BackButton
                                    callback={() =>
                                        setFormType("login")
                                    }
                                    style={{
                                        color: "#fff",
                                        textDecoration: "underline"
                                    }}
                                />
                                <CTARegistration />
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default LoginView;
