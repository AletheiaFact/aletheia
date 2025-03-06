import React from "react";
import Grid from "@mui/material/Grid";
import { useTranslation } from "next-i18next";

const HomeHeaderTitle = () => {
    const { t } = useTranslation();
    return (
        <Grid item className="home-header-title">
            <h1>{t("home:title")}</h1>
        </Grid>
    );
};

export default HomeHeaderTitle;
