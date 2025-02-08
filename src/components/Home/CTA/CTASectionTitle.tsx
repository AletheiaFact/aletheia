import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";

const CTASectionTitle = () => {
    const { t } = useTranslation();

    return (
        <Grid item sm={6} xs={12} className="footer-text">
            <p className="CTA-title">{t("home:statsFooter")}</p>
        </Grid>
    );
};

export default CTASectionTitle;
