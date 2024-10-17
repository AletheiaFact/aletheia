/* eslint-disable @next/next/no-img-element  */
/* eslint-disable jsx-a11y/anchor-has-content */
import { UpdateSettingsFlowWithTotpMethod as ValuesType } from "@ory/client";
import { Form, message, Row, Typography } from "antd";
import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { orySubmitTotp } from "../../api/ory";
import InputPassword from "../InputPassword";
import { getUiNode } from "../../lib/orysdk/utils";
import { useRouter } from "next/router";
import AletheiaButton, { ButtonType } from "../Button";
import colors from "../../styles/colors";
import userApi from "../../api/userApi";

export const Totp = ({ flow, setFlow }) => {
    const [imgSource, setImgSource] = useState("");
    const { Title } = Typography;
    const [textSource, setTextSource] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "totp",
        totp_code: "",
    };

    const getImageSource = () => {
        const img = getUiNode(flow, "id", "totp_qr");
        if (img) {
            setImgSource(img.src);
        }
    };

    const initializeCsrf = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            flowValues.csrf_token = csrfNode.value;
        }
    };

    const getTextSource = () => {
        const txt = getUiNode(flow, "id", "totp_secret_key");
        if ({ txt }) {
            setTextSource(txt?.text?.text);
        }
    };

    useEffect(() => {
        try {
            getTextSource();
            getImageSource();
            setShowForm(true);
        } catch {
            setShowForm(false);
        }
    }, [flow]);

    const onSubmitLink = (values: ValuesType) => {
        orySubmitTotp({ router, flow, setFlow, t, values })
            .then(() => {
                return userApi.updateTotp(flow.identity.traits.user_id, {
                    totp: true,
                });
            })
            .then(() => setIsLoading(false))
            .catch(() => {
                message.error(t("profile:totpIncorectCodeMessage"));
                setIsLoading(false);
            });
    };

    const onSubmitUnLink = (values: ValuesType) => {
        initializeCsrf();
        setIsLoading(true);
        orySubmitTotp({ router, flow, setFlow, t, values })
            .then(() => {
                return userApi.updateTotp(flow.identity.traits.user_id, {
                    totp: false,
                });
            })
            .then(() => setIsLoading(false))
            .catch(() => {
                message.error(t("prifile:totpUnLinkErrorMessage"));
                setIsLoading(false);
            });
    };

    const onFinishUnlink = () => {
        initializeCsrf();
        setIsLoading(true);
        flowValues = {
            ...flowValues,
            csrf_token: flowValues.csrf_token,
            totp_unlink: true,
            method: "totp",
        };
        onSubmitUnLink(flowValues);
    };

    const onFinish = (values) => {
        initializeCsrf();
        setIsLoading(true);
        flowValues = {
            ...flowValues,
            totp_code: values.totp,
        };
        onSubmitLink(flowValues);
    };

    return (
        <>
            <Row>
                <Typography.Title level={4}>
                    {t("profile:totpSectionTittle")}
                </Typography.Title>
            </Row>
            {showForm && (
                <Form onFinish={onFinish} style={{ marginBottom: "20px" }}>
                    <Form.Item>
                        <p>
                            <Trans
                                i18nKey={"profile:totpSectionDescription"}
                                components={[
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="https://www.lastpass.com"
                                        target="_blank"
                                        rel="noreferrer"
                                    ></a>,
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                                        target="_blank"
                                        rel="noreferrer"
                                    ></a>,
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                                        target="_blank"
                                        rel="noreferrer"
                                    ></a>,
                                ]}
                            />
                        </p>
                        <img
                            style={{
                                display: "flex",
                                marginLeft: "auto",
                                marginRight: "auto",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                            alt="TOTP QR code"
                            src={imgSource}
                        />
                        <p>{t("profile:totpCodeDescription")}</p>
                        <code
                            style={{
                                borderRadius: "10px",
                                backgroundColor: colors.grayPrimary,
                                color: colors.white,
                                fontSize: "18px",
                                display: "flex",
                                padding: "10px",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {textSource}
                        </code>
                    </Form.Item>
                    <Form.Item
                        name="totp"
                        label={t("profile:totpInputTittle")}
                        wrapperCol={{ sm: 24 }}
                        style={{
                            width: "100%",
                        }}
                        rules={[
                            {
                                required: true,
                                message: t("common:requiredFieldError"),
                            },
                        ]}
                    >
                        <InputPassword />
                    </Form.Item>
                    <AletheiaButton
                        type={ButtonType.blue}
                        htmlType="submit"
                        loading={isLoading}
                    >
                        {t("login:submitButton")}
                    </AletheiaButton>
                </Form>
            )}
            {!showForm && (
                <Form onFinish={onFinishUnlink}>
                    <AletheiaButton
                        loading={isLoading}
                        htmlType="submit"
                        style={{
                            width: "100%",
                            marginTop: "21px",
                            marginBottom: "21px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "8px 15px",
                            height: "max-content",
                            whiteSpace: "normal",
                        }}
                        type={ButtonType.blue}
                    >
                        <Title
                            level={4}
                            style={{
                                fontSize: 14,
                                color: colors.white,
                                fontWeight: 400,
                                margin: 0,
                            }}
                        >
                            {t("profile:totpUnLinkSubmit")}
                        </Title>
                    </AletheiaButton>
                </Form>
            )}
        </>
    );
};
