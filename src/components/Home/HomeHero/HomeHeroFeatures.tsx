import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const HomeHeroFeatures = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: <VerifiedUserOutlinedIcon />,
            label: t("home:homeHeaderFeatureMethodology"),
        },
        {
            icon: <PersonAddAlt1OutlinedIcon />,
            label: t("home:homeHeaderFeatureReviewers"),
        },
        {
            icon: <SearchOutlinedIcon />,
            label: t("home:homeHeaderFeatureSources"),
        },
    ];

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 6 }}
            alignItems="center"
            justifyContent="center"
            className="home-header-features"
        >
            {features.map((feature) => (
                <Stack
                    key={feature.label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    className="home-header-feature"
                >
                    <Box component="span" className="home-header-feature-icon">
                        {feature.icon}
                    </Box>
                    <Typography
                        component="span"
                        className="home-header-feature-label"
                    >
                        {feature.label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    );
};

export default HomeHeroFeatures;
