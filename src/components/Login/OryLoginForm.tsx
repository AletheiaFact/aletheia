import AletheiaAlert from "../AletheiaAlert";
import React from "react";

import Input from "../AletheiaInput";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import InputPassword from "../InputPassword";
import ForgotPasswordLink from "./ForgotPasswordLink";
import { Grid } from "@mui/material";
import Label from "../Label";
import { useForm } from "react-hook-form";
import TextError from "../TextErrorForm";
import { useTranslations } from "next-intl";

const OryLoginForm = ({
    flow,
    onFinish,
    onFinishFailed,
    isLoading,
    onFinishTotp,
}) => {
    const t = useTranslations();
    const tLogin = useTranslations("login");
    const tTotp = useTranslations("totp");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <>
            {flow.refresh && (
                <Grid container
                    style={{ paddingBottom: "10px" }}
                >
                    <AletheiaAlert
                        style={{ padding: "0 15px", margin: "0px" }}
                        message={tLogin("refreshLoginMessage")}
                        type="warning"
                    />
                </Grid>
            )}
            {flow?.requested_aal !== "aal2" && (
                <Grid container
                    direction="column"
                >
                    <h2>
                        {tLogin("formHeader")}
                    </h2>
                    <form
                        onSubmit={handleSubmit(onFinish, onFinishFailed)}
                    >
                        <Grid container
                            marginBottom={2}
                        >
                            <Grid item xs={12} sm={3} lg={2}>
                                <Label required
                                    children={tLogin("emailLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9} lg={10}>
                                <Input
                                    data-cy="emailFormLogin"
                                    {...register("email", {
                                        required: true
                                    })}
                                />
                                <TextError
                                    stateError={errors.email}
                                    children={tLogin("emailErrorMessage")}
                                    data-cy="testEmailErrorMessage"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} lg={2}>
                                <Label required
                                    children={tLogin("passwordLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9} lg={10} >
                                <InputPassword
                                    data-cy="passwordFormLogin"
                                    {...register("password", {
                                        required: true
                                    })}
                                />
                                <ForgotPasswordLink />
                                <TextError
                                    stateError={errors.password}
                                    children={tLogin("passwordErrorMessage")}
                                    data-cy="testPasswordErrorMessage"
                                />
                            </Grid>
                            <AletheiaButton
                                loading={isLoading}
                                type={ButtonType.primary}
                                htmlType="submit"
                                data-cy={"loginButton"}
                            >
                                {tLogin("submitButton")}
                            </AletheiaButton>
                        </Grid>
                    </form>
                </Grid>
            )}
            {flow?.requested_aal === "aal2" && (
                <Grid container direction="column">
                    <h2>
                        {tTotp("formHeader")}
                    </h2>
                    <p>
                        {tTotp("totpMessage")}
                    </p>
                    <form
                        onSubmit={handleSubmit(onFinishTotp)}
                    >
                        <Grid container display="flex">
                            <Grid item xs={12} md={5} lg={3}>
                                <Label required
                                    children={tTotp("inputLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={8} md={5} lg={3}>
                                <InputPassword
                                    data-cy="totpFormLogin"
                                    {...register("totp", {
                                        required: true,
                                    })}
                                />
                                <TextError
                                    stateError={errors.totp}
                                    children={tTotp("totpErrorMessage")}
                                    data-cy="testTotpErrorMessage"
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <AletheiaButton
                                loading={isLoading}
                                type={ButtonType.primary}
                                htmlType="submit"
                                data-cy="totpSubmitButton"
                            >
                                {tTotp("submitButton")}
                            </AletheiaButton>
                        </Grid>
                    </form>
                </Grid>
            )}
        </>
    );
};

export default OryLoginForm;
