import { LoadingOutlined } from "@ant-design/icons";
import {
    SelfServiceSettingsFlowState,
    SubmitSelfServiceSettingsFlowBody,
} from "@ory/client";
import { Alert, Form, FormInstance, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { oryGetSettingsFlow } from "../../api/ory";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";

const OryProfileView = ({ user }) => {
    const [flow, setFlow] = useState<SelfServiceSettingsFlowState>();
    const router = useRouter();
    const { t } = useTranslation();
    const formRef = useRef<FormInstance>();

    console.log("user", user);
    useEffect(() => {
        oryGetSettingsFlow({ router, setFlow, t });
    }, []);

    useEffect(() => {
        console.log("flow", flow);
    }, [flow]);

    const onFinish = (values) => {
        console.log("values", values);
    };

    if (!flow) {
        return <LoadingOutlined />;
    }

    return (
        <>
            <Row style={{ padding: "10px 0 10px 0" }}>
                <Typography.Title level={3}>
                    {t("profile:pageTitle")}
                </Typography.Title>
            </Row>
            <Row>
                <Typography.Title level={4}>
                    {t("profile:changePasswordSectionTitle")}
                </Typography.Title>
            </Row>
            {!user.firstPasswordChanged && (
                <Row style={{ paddingBottom: "10px" }}>
                    <Alert
                        message={t("profile:warningMessage")}
                        type="warning"
                    />
                </Row>
            )}
            <Form ref={formRef} onFinish={onFinish}>
                <Form.Item
                    name="newPassword"
                    label={t("profile:newPasswordLabel")}
                    rules={[
                        {
                            required: true,
                            message: t("common:requiredFieldError"),
                        },
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                    }}
                >
                    <InputPassword />
                </Form.Item>
                <Form.Item
                    name="repeatedNewPassword"
                    label={t("profile:repeatedNewPasswordLabel")}
                    rules={[
                        {
                            required: true,
                            message: t("common:requiredFieldError"),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("newPassword") === value
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
                    <Button type={ButtonType.blue} htmlType="submit">
                        {t("login:submitButton")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default OryProfileView;
