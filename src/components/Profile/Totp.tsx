import {
    SubmitSelfServiceSettingsFlowWithTotpMethodBody as ValuesType,
} from "@ory/client";
import { Alert, Form } from "antd";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { orySubmitTotp } from "../../api/ory";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import { getUiNode } from "../../lib/orysdk/utils";
import { useRouter } from "next/router";

export const Totp = ({ flow, setFlow }) => {
    const [imgSource, setImgSource] = useState("");
    const [textSource, setTextSource] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(true);
    const { t } = useTranslation();
    const router = useRouter()

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

    useEffect(() => {
        console.log(flow);
    }, [flow]);

    const onSubmitLink = (values: ValuesType) => {
        orySubmitTotp({ router, flow, setFlow, t, values })
            .then(() => {
                setErrorMessage("");
            })
            .catch(() => {
                setErrorMessage(
                    "The provided authentication code is invalid, please try again."
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
            <h3>Manage 2FA TOTP Authenticator App</h3>
            {showForm && (
                <Form onFinish={onFinish}>
                    <p>
                        Add a TOTP Authenticator App to your account to improve
                        your account security. Popular Authenticator Apps are{" "}
                        <a
                            href="https://www.lastpass.com"
                            rel="noreferrer"
                            target="_blank"
                        >
                            LastPass
                        </a>{" "}
                        and Google Authenticator (
                        <a
                            href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                            target="_blank"
                            rel="noreferrer"
                        >
                            iOS
                        </a>
                        ,{" "}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Android
                        </a>
                        ).
                    </p>
                    <img src={imgSource} />
                    <Alert type="info" message={textSource} />
                    <Form.Item
                        name="totp"
                        label={t("Save")}
                        wrapperCol={{ sm: 24 }}
                        style={{
                            width: "100%",
                        }}
                        rules={[
                            {
                                required: true,
                                message: "Fill the field before submit",
                            },
                        ]}
                    >
                        <InputPassword />
                    </Form.Item>
                    <Button type={ButtonType.blue} htmlType="submit">
                        {t("login:submitButton")}
                    </Button>
                </Form>
            )}
            {!showForm && <Button onClick={onSubmitUnLink}>UnLink</Button>}
            <p>{errorMessage}</p>
        </>
    );
};
