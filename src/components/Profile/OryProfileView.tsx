import { Avatar, Grid, Typography } from "@mui/material";
import {
    SettingsFlowState,
    UpdateSettingsFlowWithPasswordMethod as ValuesType,
} from "@ory/client";
import AletheiaAlert from "../AletheiaAlert";
import { useRouter } from "next/router";
import React, { useEffect, useState, } from "react";

import { oryGetSettingsFlow, orySubmitSettings } from "../../api/ory";
import userApi from "../../api/userApi";
import { getUiNode } from "../../lib/orysdk/utils";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import InputPassword from "../InputPassword";
import Label from "../Label";
import Loading from "../Loading";
import { Totp } from "./Totp";
import { useForm } from "react-hook-form";
import OryProfileGrid from "./OryProfileView.style";
import TextError from "../TextErrorForm";
import { useTranslations } from "next-intl";

const OryProfileView = ({ user }) => {
    const [flow, setFlow] = useState<SettingsFlowState>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations();
    const tProfile = useTranslations("profile");
    const tCommon = useTranslations("common");
    const tLogin = useTranslations("login");
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const senha = watch("newPassword");

    useEffect(() => {
        oryGetSettingsFlow({ router, setFlow, t });
    }, []);

    let flowValues: ValuesType = {
        csrf_token: "",
        method: "password",
        password: "",
    };

    const initializeCsrf = () => {
        const csrfNode = getUiNode(flow, "name", "csrf_token");
        if (csrfNode) {
            flowValues.csrf_token = csrfNode.value;
        }
    };

    const onSubmit = (values: ValuesType) => {
        orySubmitSettings({ router, flow, setFlow, t, values });
        userApi.updatePassword().then(() => {
            setIsLoading(false);
        });
    };

    const onFinish = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            initializeCsrf();
            flowValues = {
                ...flowValues,
                password: values.newPassword,
            };
            onSubmit(flowValues);
        }
    };

    if (!flow) {
        return <Loading />;
    }

    return (
        <OryProfileGrid container spacing={2} my={2}>
            <Grid item xs={7}>
                <Typography variant="h3" className="title">
                    {tProfile("pageTitle")}
                </Typography>

                <Typography variant="subtitle1" marginBottom="14px">
                    {tProfile("loggedInAs")}: <Label>{user.email}</Label>
                </Typography>

                <Typography variant="h4" className="subtitle">
                    {tProfile("badgesTitle")}
                </Typography>

                {user.badges.length > 0 ? (
                    <Grid container spacing={1} mt={1} mb={3}>
                        {user.badges?.map((badge) => (
                            <Grid item key={badge._id}>
                                <Avatar
                                    src={badge.image.content}
                                    title={badge.name}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="subtitle1">
                        {tProfile("emptyBadges")}
                    </Typography>
                )}

                <Typography variant="h4" className="subtitle">
                    {tProfile("changePasswordSectionTitle")}
                </Typography>

                {!user.firstPasswordChanged && (
                    <AletheiaAlert
                        style={{ padding: "0 10px", margin: 0 }}
                        message={tProfile("warningMessage")}
                        type="warning"
                    />
                )}
                <form
                    onSubmit={handleSubmit(onFinish)}
                    style={{ margin: "20px 0px" }}
                >
                    <Grid container>
                        <Grid item xs={12} sm={3} md={2} lg={1.5} xl={1.25}>
                            <Label required children={tProfile("newPasswordLabel") + ":"} />
                        </Grid>
                        <Grid item xs={12} sm={9} md={10} lg={10.5} xl={10.75}>
                            <InputPassword
                                data-cy="newPasswordInput"
                                {...register("newPassword", {
                                    required: true
                                })}
                            />
                            <TextError
                                stateError={errors.newPassword}
                                children={tCommon("requiredFieldError")}
                                data-cy="testNewPasswordError"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4.5} md={3.25} lg={2.5} xl={2}>
                            <Label required children={tProfile("repeatedNewPasswordLabel") + ":"} />
                        </Grid>
                        <Grid item xs={12} sm={7.5} md={8.75} lg={9.5} xl={10}>
                            <InputPassword
                                data-cy="repeatedNewPasswordInput"
                                {...register("repeatedNewPassword", {
                                    required: true,
                                    validate: (value) =>
                                        value === senha
                                })}
                            />
                            <TextError
                                stateError={errors.repeatedNewPassword}
                                children={
                                    errors.repeatedNewPassword?.type === "required"
                                        ? tCommon("requiredFieldError")
                                        : tProfile("passwordMatchErrorMessage")
                                }
                                data-cy="testRepeatedNewPasswordError"
                            />
                        </Grid>
                    </Grid>
                    <AletheiaButton
                        loading={isLoading}
                        type={ButtonType.primary}
                        htmlType="submit"
                        data-cy="submitChangePasswordButton"
                    >
                        {tLogin("submitButton")}
                    </AletheiaButton>
                </form>
                <Totp flow={flow} setFlow={setFlow} />
            </Grid>
        </OryProfileGrid>
    );
};

export default OryProfileView;
