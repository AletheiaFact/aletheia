import { Grid } from "@mui/material";
import React from "react";
import FooterCtaActions from "./FooterCtaActions";
import { Box, Typography } from "@mui/material";
import { useFooterData } from "../hooks/useFooterData";

const FooterCta = () => {
    const { t } = useFooterData();

    return (
        <Box className="footer-cta-card">
            <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                    <Typography variant="h2" className="footer-cta-title">
                        {t("footer:cta.title")}
                    </Typography>
                    <Typography className="footer-cta-description">
                        {t("footer:cta.description")}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                    <FooterCtaActions />
                </Grid>
            </Grid>
        </Box>
    );
};

export default FooterCta;
