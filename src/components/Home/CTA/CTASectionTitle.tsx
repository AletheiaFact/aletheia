import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import { useAtom } from "jotai";

const CTASectionTitle = () => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <Grid container md={6} sm={isLoggedIn ? 12 : 6} xs={12} className="footer-text">
            <p className="CTA-title">{t("home:statsFooter")}</p>
        </Grid>
    );
};

export default CTASectionTitle;
