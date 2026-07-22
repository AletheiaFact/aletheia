import React, { useRef, useState } from "react";

import AletheiaAlert from "../AletheiaAlert";
import Input from "../AletheiaInput";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import InputPassword from "../InputPassword";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import Label from "../Label";
import TextError from "../TextErrorForm";
import AletheiaCaptcha from "../AletheiaCaptcha";
import { useTranslations } from "next-intl";

const SignUpForm = ({ onFinish, onFinishFailed, isLoading }) => {
    const tCommon = useTranslations("common");
    const tMaterials = useTranslations("materials");
    const tLogin = useTranslations("login");
    const tProfile = useTranslations("profile");
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
            onFinishFailed(tCommon("requiredFieldError"));
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
                        {tMaterials("disclaimerFirstParagraph")} <br />
                        <br />
                        {tMaterials("disclaimerSecondParagraph")}{" "}
                        <a href="email:contato@aletheiafact.org">
                            contato@aletheiafact.org
                        </a>
                        .
                    </>
                }
            />
            <h2>{tLogin("signupFormHeader")}</h2>
            <form onSubmit={handleSubmit(handleFormSubmit, onFinishFailed)}>
                <Grid container>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={tLogin("nameLabel") + " :"}
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
                            data-cy="nameError"
                            stateError={errors.name}
                            children={tLogin("nameErrorMessage")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={tLogin("emailLabel") + " :"}
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
                            data-cy="emailError"
                            stateError={errors.email}
                            children={
                                errors.email?.type === "pattern"
                                    ? tLogin("invalidEmailErrorMessage")
                                    : tLogin("emailErrorMessage")
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={tLogin("passwordLabel") + " :"}
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
                            data-cy="passwordError"
                            stateError={errors.password}
                            children={tLogin("passwordErrorMessage")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label
                            required
                            children={tLogin("repeatPasswordLabel") + " :"}
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
                            data-cy="repeatedPasswordError"
                            stateError={errors.repeatedPassword}
                            children={
                                errors.repeatedPassword?.type === "required"
                                    ? tCommon("requiredFieldError")
                                    : tProfile("passwordMatchErrorMessage")
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Label required>
                            {tCommon("captchaLabel") + " :"}
                        </Label>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <AletheiaCaptcha
                            ref={captchaRef}
                            onChange={setCaptchaString}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <AletheiaButton
                        loading={isLoading}
                        type={ButtonType.primary}
                        htmlType="submit"
                        data-cy="loginButton"
                    >
                        {tLogin("submitButton")}
                    </AletheiaButton>
                </Grid>
            </form>
        </div>
    );
};

export default SignUpForm;
