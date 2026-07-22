import { Grid } from "@mui/material";
import React from "react";
import AletheiaButton, { ButtonType } from "./AletheiaButton";
import { useTranslations } from "next-intl";

const LoginButton = () => {
    const tClaimReviewForm = useTranslations("claimReviewForm");

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
                {tClaimReviewForm("loginButton").toUpperCase()}
            </AletheiaButton>
        </Grid>
    );
};

export default LoginButton;
