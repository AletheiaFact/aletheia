import { Grid, Typography } from "@mui/material";
import React from "react";
import colors from "../styles/colors";
import { useTranslations } from "next-intl";

const PartialReviewWarning = () => {
    const tClaimReview = useTranslations("claimReview");
    return (
        <Grid item marginLeft={20} style={{ display: "flex", padding: 10 }} xs={7}>
            <Typography variant="body1" style={{ color: colors.error, fontSize: 16 }}>* </Typography>
            <span style={{ color: colors.neutral }}>
                {tClaimReview("partialReviewWarning")}
            </span>
        </Grid>
    );
};

export default PartialReviewWarning;
