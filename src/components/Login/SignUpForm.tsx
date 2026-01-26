import { useTranslation } from "next-i18next";
import React, { useRef, useState } from "react";

import AletheiaAlert from "../AletheiaAlert";
import Input from "../AletheiaInput";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import Label from "../Label";
import TextError from "../TextErrorForm";
import AletheiaCaptcha from "../AletheiaCaptcha";

const SignUpForm = ({ onFinish, onFinishFailed, isLoading }) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const senha = watch("password");
    const captchaRef = useRef(null);
    const [captchaString, setCaptchaString] = useState("");

    const handleFormSubmit = (values) => {
        if (!captchaString) {
            onFinishFailed(t("common:requiredFieldError"));
            return;
        }
        onFinish({ ...values, recaptcha: captchaString });
    };

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
            <form onSubmit={handleSubmit(handleFormSubmit, onFinishFailed)}>
                <Grid container>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={t("login:nameLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Input
                            data-cy="nameInputCreateAccount"
                            {...register("name", {
                                required: true,
                            })}
                        />
                        <TextError
                            stateError={errors.name}
                            children={t("login:nameErrorMessage")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={t("login:emailLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Input
                            data-cy="emailInputCreateAccount"
                            {...register("email", {
                                required: true,
                                pattern:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            })}
                        />
                        <TextError
                            stateError={errors.email}
                            children={
                                errors.email?.type === "pattern"
                                    ? t("login:invalidEmailErrorMessage")
                                    : t("login:emailErrorMessage")
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={t("login:passwordLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <InputPassword
                            data-cy="passwordInputCreateAccount"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <TextError
                            stateError={errors.password}
                            children={t("login:passwordErrorMessage")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={t("login:repeatPasswordLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <InputPassword
                            data-cy="repeatedPasswordInputCreateAccount"
                            {...register("repeatedPassword", {
                                required: true,
                                validate: (value) => value === senha,
                            })}
                        />
                        <TextError
                            stateError={errors.repeatedPassword}
                            children={
                                errors.repeatedPassword?.type === "required"
                                    ? t("common:requiredFieldError")
                                    : t("profile:passwordMatchErrorMessage")
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={t("common:captchaLabel") + " :"}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <AletheiaCaptcha
                            ref={captchaRef}
                            onChange={setCaptchaString}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Button
                        loading={isLoading}
                        type={ButtonType.blue}
                        htmlType="submit"
                        data-cy="loginButton"
                    >
                        {t("login:submitButton")}
                    </Button>
                </Grid>
            </form>
        </div>
    );
};

export default SignUpForm;
