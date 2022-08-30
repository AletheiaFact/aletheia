import {
    SelfServiceSettingsFlow,
    SubmitSelfServiceSettingsFlowWithPasswordMethodBody as ValuesType,
} from "@ory/client";
import { Alert, Form, FormInstance, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { oryGetSettingsFlow, orySubmitSettings } from "../../api/ory";
import api from "../../api/user";
import { getUiNode } from "../../lib/orysdk/utils";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import Loading from "../Loading";
import { Totp } from "./Totp";

const OryProfileView = ({ user }) => {
    const [flow, setFlow] = useState<SelfServiceSettingsFlow>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
    const formRef = useRef<FormInstance>();

    useEffect(() => {
        oryGetSettingsFlow({ router, setFlow, t });
    }, []);

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
    };

    const initializeCsrf = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            flowValues.csrf_token = csrfNode.value;
        }
    };

    const onSubmit = (values: ValuesType) => {
        orySubmitSettings({ router, flow, setFlow, t, values });
        api.updatePassword({ userId: user._id }, t).then(() => {
            setIsLoading(false);
        });
    };

    const onFinish = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            initializeCsrf();
            flowValues = {
                ...flowValues,
                password: values.newPassword,
            };
            onSubmit(flowValues);
        }
    };

    if (!flow) {
        return <Loading />;
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
                    <Button
                        loading={isLoading}
                        type={ButtonType.blue}
                        htmlType="submit"
                    >
                        {t("login:submitButton")}
                    </Button>
                </Form.Item>
            </Form>
            <Totp flow={flow} setFlow={setFlow} />
        </>
    );
};

export default OryProfileView;
