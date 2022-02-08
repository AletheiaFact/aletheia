import React, { useRef, useState } from "react";
import {
    Alert,
    Form,
    message,
    Row,
    Typography
} from "antd";
import api from "../../api/user";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";

const ProfileView = ({ user }) => {
    const formRef = useRef();
    const { t } = useTranslation();

    const [loadingFinish, setLoadingFinish] = useState(false);

    const updatePassword = (data) => {
        return api.updatePassword(
            {
                userId: user._id,
                ...data
            },
            t
        );
    }

    const onFinish = async (values) => {
        setLoadingFinish(true);
        const result = await updatePassword(values);
        if (!result.success) {
            message.error(result.message);
        } else {
            message.success(t("profile:successMessage"));
            formRef.current.resetFields();
        }
        setLoadingFinish(false);
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
                    name="currentPassword"
                    label={t("profile:currentPasswordLabel")}
                    rules={[
                        {
                            required: true,
                            message: t("common:requiredFieldError")
                        }
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%"
                    }}
                >
                    <InputPassword />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label={t("profile:newPasswordLabel")}
                    rules={[
                        {
                            required: true,
                            message: t("common:requiredFieldError")
                        }
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%"
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
                            message: t("common:requiredFieldError")
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("newPassword") ===
                                    value
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
                            }
                        })
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%"
                    }}
                >
                    <InputPassword />
                </Form.Item>
                <Form.Item>
                    <Button
                        type={ButtonType.blue}
                        htmlType="submit"
                        loading={loadingFinish}
                    >
                        {t("login:submitButton")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProfileView;
