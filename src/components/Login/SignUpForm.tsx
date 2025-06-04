import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaAlert from "../AletheiaAlert";
import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import Label from "../Label";
import colors from "../../styles/colors";

const SignUpForm = ({ onFinish, onFinishFailed, isLoading }) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const senha = watch("password");

    return (
        <div>
            <AletheiaAlert
                type="info"
                message={
                    <>
                        {t("materials:disclaimerFirstParagraph")} <br />
                        <br />
                        {t("materials:disclaimerSecondParagraph")}{" "}
                        <a href="email:contato@aletheiafact.org">
                            contato@aletheiafact.org
                        </a>
                        .
                    </>
                }
            />
            <h2>{t("login:signupFormHeader")}</h2>
            <form
                onSubmit={handleSubmit(onFinish)}
                onError={onFinishFailed}
            >
                <Grid container>
                    <Grid item xs={3}>
                        <Label required
                            children={t("login:nameLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Input
                            {...register("nameDescription", {
                                required: true
                            })}
                        />
                        <p
                            style={{
                                fontSize: 14,
                                color: colors.error,
                                visibility: errors.nameDescription ? "visible" : "hidden",
                            }}>
                            {t("login:nameErrorMessage")}
                        </p>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <Label required
                            children={t("login:emailLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Input
                            {...register("email", {
                                required: true,
                                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                            })}
                        />
                        <p
                            style={{
                                fontSize: 14,
                                color: colors.error,
                                visibility: errors.email ? "visible" : "hidden",
                            }}
                        >
                            {errors.email?.type === "pattern"
                                ? t("login:invalidEmailErrorMessage")
                                : t("login:emailErrorMessage")
                            }
                        </p>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <Label required
                            children={t("login:passwordLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <InputPassword
                            {...register("password", {
                                required: true
                            })}
                        />
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
                <Grid container
                    style={{
                        width: "100%",
                    }}
                >
                    <Grid item xs={3}>
                        <Label required
                            children={t("login:repeatPasswordLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <InputPassword
                            {...register("repeatedPassword", {
                                required: true,
                                validate: (value) =>
                                    value === senha
                            })}
                        />
                        {errors.repeatedPassword && (
                            <p
                                style={{
                                    fontSize: 14,
                                    color: colors.error,
                                    visibility: "visible",
                                }}
                            >
                                {errors.repeatedPassword.type === "required"
                                    ? t("common:requiredFieldError")
                                    : t("profile:passwordMatchErrorMessage")}
                            </p>
                        )}
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid item
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
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default SignUpForm;
