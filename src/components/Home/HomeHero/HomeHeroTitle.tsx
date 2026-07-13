import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const HomeHeroTitle = () => {
    const tHome = useTranslations("home");
    return (
        <Grid item className="home-header-title">
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                className="home-header-badge"
            >
                <Box component="span" className="home-header-badge-dot" />
                <Typography
                    component="span"
                    className="home-header-badge-text"
                >
                    {tHome("homeHeaderBadge")}
                </Typography>
            </Stack>
            <Typography variant="h1">
                {
                    tHome.rich("homeHeaderTitle", {
                        line1: (chunks) => (
                            <Box
                                component="span"
                                className="home-header-title-line"
                            >
                                {chunks}
                            </Box>
                        ),
                        line2: (chunks) => (
                            <Box
                                component="span"
                                className="home-header-title-line"
                            >
                                {chunks}
                            </Box>
                        ),
                        highlight: (chunks) => (
                            <Box
                                component="span"
                                className="home-header-title-highlight"
                            >
                                {chunks}
                            </Box>
                        ),
                    })
                }
            </Typography>
            <Typography component="p" className="home-header-description">
                {tHome("statsFooter")}
            </Typography>
        </Grid>
    );
};

export default HomeHeroTitle;
