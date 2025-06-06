import AletheiaAlert from "../AletheiaAlert";
import { useTranslation } from "next-i18next";
import React from "react";

import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import ForgotPasswordLink from "./ForgotPasswordLink";
import { Grid } from "@mui/material";
import Label from "../Label";
import { useForm } from "react-hook-form";
import TextError from "../TextErrorForm";

const OryLoginForm = ({
    flow,
    onFinish,
    onFinishFailed,
    isLoading,
    onFinishTotp,
}) => {
    const { t } = useTranslation();
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
                        message={t("login:refreshLoginMessage")}
                        type="warning"
                    />
                </Grid>
            )}
            {flow?.requested_aal !== "aal2" && (
                <Grid container
                    direction="column"
                >
                    <h2>
                        {t("login:formHeader")}
                    </h2>
                    <form
                        onSubmit={handleSubmit(onFinish, onFinishFailed)}
                    >
                        <Grid container
                            marginBottom={2}
                        >
                            <Grid item xs={12} sm={2.25} lg={1.25}>
                                <Label required
                                    children={t("login:emailLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9.75} lg={10.75}>
                                <Input
                                    {...register("email", {
                                        required: true
                                    })}
                                />
                                <TextError
                                    stateError={errors.email}
                                    children={t("login:emailErrorMessage")}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2.25} lg={1.25}>
                                <Label required
                                    children={t("login:passwordLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9.75} lg={10.75} >
                                <InputPassword
                                    {...register("password", {
                                        required: true
                                    })}
                                />
                                <ForgotPasswordLink t={t} />
                                <TextError
                                    stateError={errors.password}
                                    children={t("login:passwordErrorMessage")}
                                />
                            </Grid>
                            <Button
                                loading={isLoading}
                                type={ButtonType.blue}
                                htmlType="submit"
                                data-cy={"loginButton"}
                            >
                                {t("login:submitButton")}
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            )}
            {flow?.requested_aal === "aal2" && (
                <Grid container direction="column">
                    <h2>
                        {t("totp:formHeader")}
                    </h2>
                    <p>
                        {t("totp:totpMessage")}
                    </p>
                    <form
                        onSubmit={handleSubmit(onFinishTotp)}
                    >
                        <Grid container display="flex">
                            <Grid item xs={12} md={5} lg={3}>
                                <Label required
                                    children={t("totp:inputLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={8} md={5} lg={3}>
                                <InputPassword
                                    {...register("totp", {
                                        required: true,
                                    })}
                                />
                                <TextError
                                    stateError={errors.totp}
                                    children={t("totp:totpErrorMessage")}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Button
                                loading={isLoading}
                                type={ButtonType.blue}
                                htmlType="submit"
                            >
                                {t("totp:submitButton")}
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            )}
        </>
    );
};

export default OryLoginForm;
