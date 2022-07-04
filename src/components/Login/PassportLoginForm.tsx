import { Form, message, Row } from "antd";
import Input from "../AletheiaInput";
import InputPassword from "../InputPassword";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import BackButton from "../BackButton";
import CTARegistration from "../Home/CTARegistration";
import React from "react";
import api from "../../api/user";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const PassportLoginForm = (props) => {
    const { t } = useTranslation();
    const { previousUrl, host, formType, setFormType } = props
    const router = useRouter();
    const shouldGoBack = previousUrl.startsWith(host)

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
            if (shouldGoBack) {
                router.back()
            }
            else {
                router.push('/')
            }
        }
    };

    return (
        <>
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
    </>
    )
}

export default PassportLoginForm;
