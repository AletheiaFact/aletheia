import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../styles/colors";

const PartialReviewWarning = () => {
    const { t } = useTranslation();
    return (
        <Grid item marginLeft={20} style={{ display: "flex", padding: 10 }} xs={7}>
            <Typography variant="body1" style={{ color: colors.error, fontSize: 16 }}>* </Typography>
            <span style={{ color: colors.neutral }}>
                {t("claimReview:partialReviewWarning")}
            </span>
        </Grid>
    );
};

export default PartialReviewWarning;
