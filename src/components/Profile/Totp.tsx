import { SubmitSelfServiceSettingsFlowWithTotpMethodBody as ValuesType } from "@ory/client";
import { Form, Row, Typography } from "antd";
import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { orySubmitTotp } from "../../api/ory";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import { getUiNode } from "../../lib/orysdk/utils";
import { useRouter } from "next/router";
import AletheiaButton from "../Button";
import colors from "../../styles/colors";

export const Totp = ({ flow, setFlow }) => {
    const [imgSource, setImgSource] = useState("");
    const { Title } = Typography;
    const [textSource, setTextSource] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(true);
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
    //Remove When Task Finished
    useEffect(() => {
        console.log(flow, "Flow");
    }, [flow]);

    const onSubmitLink = (values: ValuesType) => {
        orySubmitTotp({ router, flow, setFlow, t, values })
            .then(() => {
                setErrorMessage("");
            })
            .catch(() => {
                setErrorMessage(
                    t("profile:totpIncorectCodeMessage")
                );
            });
    };

    const onSubmitUnLink = () => {
        initializeCsrf();
        const values = {
            csrf_token: flowValues.csrf_token,
            totp_unlink: true,
            method: "totp",
        };
        orySubmitTotp({ router, flow, setFlow, t, values })
            .then(() => {
                setErrorMessage("");
            })
            .catch(() => {
                setErrorMessage("Erro UnLink.");
            });
    };

    const onFinish = (values) => {
        initializeCsrf();
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
                <Form onFinish={onFinish}>
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
                            src={imgSource}
                        />
                        <p>{t("profile:totpCodeDescription")}</p>
                        <code
                            style={{
                                borderRadius: "10px",
                                backgroundColor: "#4a4c58",
                                color: "#FFF",
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
                        validateStatus="error"
                        help={errorMessage}
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
                        <InputPassword/>
                    </Form.Item>
                    <Button type={ButtonType.blue} htmlType="submit">
                        {t("login:submitButton")}
                    </Button>
                </Form>
            )}
            {!showForm && (
                <AletheiaButton
                    onClick={onSubmitUnLink}
                    style={{
                        width: "100%",
                        marginTop: "21px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: 0,
                    }}
                    type={ButtonType.blue}
                >
                    <Title
                        level={4}
                        style={{
                            fontSize: 14,
                            color: colors.white,
                            fontWeight: 400,
                        }}
                    >
                        {t("profile:totpUnLinkSubmit")}
                    </Title>
                </AletheiaButton>
            )}
        </>
        //Find a better way to set this message
    );
};
