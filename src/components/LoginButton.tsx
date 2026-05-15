import { Grid } from "@mui/material";
import React from "react";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "./AletheiaButton";

const LoginButton = () => {
    const { t } = useTranslation();

    return (
        <Grid
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "0px 0px 15px 0px",
            }}
        >
            <AletheiaButton
                type={ButtonType.primary}
                href="/login"
            >
                {t("claimReviewForm:loginButton").toUpperCase()}
            </AletheiaButton>
        </Grid>
    );
};

export default LoginButton;
