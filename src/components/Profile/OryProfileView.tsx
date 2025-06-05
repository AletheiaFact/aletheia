import { Avatar, Grid, Typography } from "@mui/material";
import {
    SettingsFlowState,
    UpdateSettingsFlowWithPasswordMethod as ValuesType,
} from "@ory/client";
import AletheiaAlert from "../AletheiaAlert";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState, } from "react";

import { oryGetSettingsFlow, orySubmitSettings } from "../../api/ory";
import userApi from "../../api/userApi";
import { getUiNode } from "../../lib/orysdk/utils";
import Button, { ButtonType } from "../Button";
import InputPassword from "../InputPassword";
import Label from "../Label";
import Loading from "../Loading";
import { Totp } from "./Totp";
import { useForm } from "react-hook-form";
import colors from "../../styles/colors";

const OryProfileView = ({ user }) => {
    const [flow, setFlow] = useState<SettingsFlowState>();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
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
        <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            my={2}
        >
            <Grid item xs={7}>
                <Typography variant="h3" fontSize={24} fontWeight={600} fontFamily="initial" marginBottom="12px">
                    {t("profile:pageTitle")}
                </Typography>

                <Typography variant="subtitle1" marginBottom="14px">
                    {t("profile:loggedInAs")}: <Label>{user.email}</Label>
                </Typography>

                <Typography variant="h4" fontSize={20} fontWeight={600} fontFamily="initial" margin="24px 0px 10px">
                    {t("profile:badgesTitle")}
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
                        {t("profile:emptyBadges")}
                    </Typography>
                )}

                <Typography variant="h4" fontSize={20} fontWeight={600} fontFamily="initial" margin="24px 0px 10px">
                    {t("profile:changePasswordSectionTitle")}
                </Typography>

                {!user.firstPasswordChanged && (
                    <AletheiaAlert
                        style={{ padding: "0 10px", margin: 0 }}
                        message={t("profile:warningMessage")}
                        type="warning"
                    />
                )}
                <form onSubmit={handleSubmit(onFinish)} style={{ margin: "20px 0px" }}>
                    <Grid container>
                        <Grid item xs={1.5}>
                            <Label required children={t("profile:newPasswordLabel") + ":"} />
                        </Grid>
                        <Grid item xs={10.5}>
                            <InputPassword
                                {...register("newPassword", {
                                    required: true
                                })}
                            />
                            <p
                                style={{
                                    fontSize: 14,
                                    color: "red",
                                    visibility: errors.newPassword ? "visible" : "hidden",
                                }}
                            >
                                {t("common:requiredFieldError")}
                            </p>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={2}>
                            <Label required children={t("profile:repeatedNewPasswordLabel") + ":"} />
                        </Grid>
                        <Grid item xs={10}>
                            <InputPassword
                                {...register("repeatedNewPassword", {
                                    required: true,
                                    validate: (value) =>
                                        value === senha
                                })}
                            />
                            {errors.repeatedNewPassword && (
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: colors.error,
                                    }}
                                >
                                    {errors.repeatedNewPassword.type === "required"
                                        ? t("common:requiredFieldError")
                                        : t("profile:passwordMatchErrorMessage")}
                                </p>
                            )}
                        </Grid>
                    </Grid>
                    <Button
                        loading={isLoading}
                        type={ButtonType.blue}
                        htmlType="submit"
                    >
                        {t("login:submitButton")}
                    </Button>
                </form>
                <Totp flow={flow} setFlow={setFlow} />
            </Grid>
        </Grid>
    );
};

export default OryProfileView;
