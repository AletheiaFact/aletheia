import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "next-i18next";

const HomeHeroTitle = () => {
    const { t } = useTranslation();
    return (
        <Grid item className="home-header-title">
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className="home-header-badge"
            >
                <Box component="span" className="home-header-badge-dot" />
                <Typography component="span" className="home-header-badge-text">
                    {t("home:homeHeaderBadge")}
                </Typography>
            </Stack>
            <Typography variant="h1">
                <Trans
                    i18nKey="home:homeHeaderTitle"
                    components={{
                        line1: (
                            <Box
                                component="span"
                                className="home-header-title-line"
                            />
                        ),
                        line2: (
                            <Box
                                component="span"
                                className="home-header-title-line"
                            />
                        ),
                        highlight: (
                            <Box
                                component="span"
                                className="home-header-title-highlight"
                            />
                        ),
                    }}
                />
            </Typography>
            <Typography component="p" className="home-header-description">
                {t("home:statsFooter")}
            </Typography>
        </Grid>
    );
};

export default HomeHeroTitle;
