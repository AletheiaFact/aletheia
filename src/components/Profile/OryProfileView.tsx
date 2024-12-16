import { Avatar, Grid } from "@mui/material";
import {
    SettingsFlowState,
    UpdateSettingsFlowWithPasswordMethod as ValuesType,
} from "@ory/client";
import { Alert, Form, FormInstance, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { oryGetSettingsFlow, orySubmitSettings } from "../../api/ory";
import userApi from "../../api/userApi";
import { getUiNode } from "../../lib/orysdk/utils";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import Label from "../Label";
import Loading from "../Loading";
import { Totp } from "./Totp";

const OryProfileView = ({ user }) => {
    const [flow, setFlow] = useState<SettingsFlowState>();
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
        userApi.updatePassword().then(() => {
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
        <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            my={2}
        >
            <Grid item xs={7}>
                <Typography.Title level={3}>
                    {t("profile:pageTitle")}
                </Typography.Title>

                <Typography>
                    {t("profile:loggedInAs")}: <Label>{user.email}</Label>
                </Typography>

                <Typography.Title level={4}>
                    {t("profile:badgesTitle")}
                </Typography.Title>

                {user.badges.length > 0 ? (
                    <Grid container spacing={1} mt={1} mb={3}>
                        {user.badges?.map((badge) => (
                            <Grid item key={badge._id}>
                                <Avatar
                                    src={badge.image.content}
                                    title={badge.name}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography.Text>
                        {t("profile:emptyBadges")}
                    </Typography.Text>
                )}

                <Typography.Title level={4}>
                    {t("profile:changePasswordSectionTitle")}
                </Typography.Title>

                {!user.firstPasswordChanged && (
                    <Alert
                        style={{ marginBottom: "1rem" }}
                        message={t("profile:warningMessage")}
                        type="warning"
                    />
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
                                            t(
                                                "profile:passwordMatchErrorMessage"
                                            )
                                        )
                                    );
                                },
                            }),
                        ]}
                        wrapperCol={{ sm: 24 }}
                    >
                        <InputPassword />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            loading={isLoading}
                            buttonType={ButtonType.blue}
                            htmlType="submit"
                        >
                            {t("login:submitButton")}
                        </Button>
                    </Form.Item>
                </Form>
                <Totp flow={flow} setFlow={setFlow} />
            </Grid>
        </Grid>
    );
};

export default OryProfileView;
