import {
    LoginFlow,
    UpdateLoginFlowBody,
    UpdateLoginFlowWithPasswordMethod as ValuesType,
} from "@ory/client";
import Grid from "@mui/material/Grid";
import global from "../Messages";
import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { oryGetLoginFlow, orySubmitLogin } from "../../api/ory";
import userApi from "../../api/userApi";
import { ory } from "../../lib/orysdk";
import { handleFlowError } from "../../lib/orysdk/errors";
import { getUiNode } from "../../lib/orysdk/utils";
import Loading from "../Loading";

import OryLoginForm from "./OryLoginForm";
import SignUpForm from "./SignUpForm";
import CTAButton from "../Home/CTAButton";
import { ButtonType } from "../Button";

const LoginView = ({ isSignUp = false, shouldGoBack = false }) => {
    const [flow, setFlow] = useState<LoginFlow>();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        oryGetLoginFlow({ router, setFlow, t });
    }, [router, t]);

    const submitLogin = (password, email) => {
        initializeCsrf();
        flowValues = {
            ...flowValues,
            password,
            password_identifier: email,
        };
        orySubmitLogin({
            router,
            flow,
            setFlow,
            t,
            values: flowValues,
            shouldGoBack,
        }).then(() => {
            setIsLoading(false);
        });
    };

    const onSubmitTotp = (values: UpdateLoginFlowBody) =>
        ory.frontend
            .updateLoginFlow({
                flow: String(flow?.id),
                updateLoginFlowBody: values,
            })
            // We logged in successfully! Let's bring the user home.
            .then(() => {
                if (flow?.return_to) {
                    window.location.href = flow?.return_to;
                    return;
                }
                if (shouldGoBack) {
                    router.back();
                } else {
                    router.push("/");
                }
            })
            .catch(handleFlowError(router, "login", setFlow, t))
            .catch((err: AxiosError) => {
                // If the previous handler did not catch the error it's most likely a form validation error
                if (err.response?.status === 400) {
                    // Yup, it is!
                    setFlow(err.response?.data);
                    return global.showMessage("error", `${t("profile:totpIncorectCodeMessage")}`);
                }

                return Promise.reject(err);
            });

    if (!flow) {
        return <Loading />;
    }

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
        password_identifier: "",
        identifier: "",
    };

    let totpValues = {
        csrf_token: "",
        method: "totp",
        totp_code: "",
    };

    const initializeCsrf = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            flowValues.csrf_token = csrfNode.value;
        }
    };

    const initializeCsrfTotp = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            totpValues.csrf_token = csrfNode.value;
        }
    };

    const onFinish = (values) => {
        setIsLoading(true);
        const { password, email } = values;
        if (!isSignUp) {
            submitLogin(password, email);
        } else {
            const payload = {
                email,
                password,
                name: values.name,
            };
            userApi.register(payload, t).then((res) => {
                if (!res?.error) {
                    submitLogin(password, email);
                }
                setIsLoading(false);
            });
        }
    };

    const onFinishTotp = (values) => {
        initializeCsrfTotp();
        totpValues = {
            ...totpValues,
            totp_code: values.totp,
        };
        onSubmitTotp(totpValues);
    };

    const onFinishFailed = (errorInfo) => {
        if (typeof errorInfo === "string") {
            global.showMessage("error", errorInfo)
        } else {
            global.showMessage("error", `${t("login:loginFailedMessage")}`);
        }
        setIsLoading(false);
    };

    return (
        <Grid container
            justifyContent="center"
            style={{ marginTop: 45, height: "100%", padding: "24px" }}
        >
            <Grid item xs={11} sm={6}>
                {isSignUp ? (
                    <SignUpForm
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        isLoading={isLoading}
                    />
                ) : (
                    <>
                        <OryLoginForm
                            flow={flow}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            isLoading={isLoading}
                            onFinishTotp={onFinishTotp}
                        />
                        <Grid container className="typo-grey typo-center">
                            <h2>{t("login:signUpHeader")}</h2>
                        </Grid>
                        <CTAButton type={ButtonType.blue} />
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default LoginView;
