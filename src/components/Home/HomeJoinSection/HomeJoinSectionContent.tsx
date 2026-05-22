import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "next-i18next";
import { trackUmamiEvent } from "../../../lib/umami";

const HomeJoinSectionContent = () => {
    const { t } = useTranslation();

    return (
        <Stack className="home-join-content">
            <Box component="span" className="home-join-badge">
                {t("home:homeJoinBadge")}
            </Box>
            <Typography
                variant="h2"
                component="h2"
                className="home-join-title"
            >
                {t("home:homeJoinTitle")}
            </Typography>
            <Typography
                variant="body1"
                component="p"
                className="home-join-description"
            >
                {t("home:homeJoinDescription")}
            </Typography>
            <Box className="home-join-actions">
                <Button
                    href="/sign-up"
                    onClick={() =>
                        trackUmamiEvent(
                            "home-join-sign-up-button",
                            "homeJoinSignUp"
                        )
                    }
                    className="home-join-action-button home-join-action-primary"
                    endIcon={
                        <ArrowForwardIcon className="home-join-action-icon" />
                    }
                    data-cy="testHomeJoinSignUpButton"
                >
                    {t("home:homeJoinPrimaryButton")}
                </Button>
                <Button
                    href="/about"
                    onClick={() =>
                        trackUmamiEvent(
                            "home-join-about-us-button",
                            "homeJoinAboutUs"
                        )
                    }
                    className="home-join-action-button home-join-action-secondary"
                    data-cy="testHomeJoinAboutUsButton"
                >
                    {t("home:homeJoinSecondaryButton")}
                </Button>
            </Box>
        </Stack>
    );
};

export default HomeJoinSectionContent;