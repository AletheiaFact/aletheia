import AletheiaAlert from "../AletheiaAlert";
import { useTranslation } from "next-i18next";
import React from "react";

import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import ForgotPasswordLink from "./ForgotPasswordLink";
import { Grid } from "@mui/material";
import Label from "../Label";
import colors from "../../styles/colors";
import { useForm } from "react-hook-form";

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
                <>
                    <Grid container className="typo-grey typo-center">
                        <h2>{t("login:formHeader")}</h2>
                    </Grid>
                    <form
                        onSubmit={handleSubmit(onFinish, onFinishFailed)}
                    >
                        <Grid container>
                            <Grid item xs={1}>
                                <Label required
                                    children={t("login:emailLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <Input
                                    {...register("email", {
                                        required: true
                                    })}
                                />
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: colors.error,
                                        visibility: errors.email ? "visible" : "hidden",
                                    }}
                                >
                                    {t("login:emailErrorMessage")}
                                </p>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={1}>
                                <Label required
                                    children={t("login:passwordLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={11}>
                                <InputPassword
                                    {...register("password", {
                                        required: true
                                    })}
                                />
                                <ForgotPasswordLink t={t} />
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: colors.error,
                                        visibility: errors.password ? "visible" : "hidden",
                                    }}
                                >
                                    {t("login:passwordErrorMessage")}
                                </p>
                            </Grid>
                        </Grid>
                        <div
                            style={{
                                justifyContent: "space-between",
                                display: "flex",
                            }}
                        >
                            <Button
                                loading={isLoading}
                                type={ButtonType.blue}
                                htmlType="submit"
                                data-cy={"loginButton"}
                            >
                                {t("login:submitButton")}
                            </Button>
                        </div>
                    </form>
                </>
            )}
            {flow?.requested_aal === "aal2" && (
                <>
                    <Grid container
                        className="typo-grey typo-center"
                        marginTop={2}
                    >
                        <h2>{t("totp:formHeader")}</h2>
                    </Grid>
                    <p>{t("totp:totpMessage")}</p>
                    <form onSubmit={handleSubmit(onFinishTotp)}>
                        <Grid container>
                            <Grid item xs={2.5}>
                                <Label required
                                    children={t("totp:inputLabel") + " :"}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <InputPassword
                                    {...register("totp", {
                                        required: true,
                                    })}
                                />
                                {errors.totp &&
                                    <p
                                        style={{
                                            color: colors.error,
                                            marginTop: 4,
                                        }}
                                    >
                                        {t("totp:totpErrorMessage")}
                                    </p>
                                }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <div
                                style={{
                                    justifyContent: "space-between",
                                    display: "flex",
                                }}
                            >
                                <Button
                                    loading={isLoading}
                                    type={ButtonType.blue}
                                    htmlType="submit"
                                >
                                    {t("totp:submitButton")}
                                </Button>
                            </div>
                        </Grid>
                    </form>
                </>
            )}
        </>
    );
};

export default OryLoginForm;
