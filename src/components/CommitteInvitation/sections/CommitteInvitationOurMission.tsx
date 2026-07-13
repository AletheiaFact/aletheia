import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import {
    SecurityOutlined,
    HubOutlined,
    SchoolOutlined,
    OpenInNewOutlined,
    FormatQuote,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";

const missionItems = [
    { key: "combat", icon: <SecurityOutlined /> },
    { key: "network", icon: <HubOutlined /> },
    { key: "training", icon: <SchoolOutlined /> },
    { key: "openSource", icon: <OpenInNewOutlined /> },
];

const CommitteInvitationOurMission = () => {
    const t = useTranslations("committeeInvitation");

    return (
        <Box className="section-wrapper">
            <Box className="container-section">
                <Stack spacing={2} alignItems="center" sx={{ mb: 6 }} id="mission">
                    <Typography variant="overline" className="section-eyebrow">
                        {t("mission.eyebrow")}
                    </Typography>
                    <Typography variant="h2" className="section-title">
                        {t("mission.title")}
                    </Typography>
                    <Typography variant="body1" className="section-description">
                        {t("mission.description")}
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {missionItems.map(({ key, icon }) => (
                        <Grid item xs={12} sm={6} md={3} key={key}>
                            <Stack className="mission-card" spacing={2}>
                                <Box className="benefit-icon-wrapper">{icon}</Box>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        className="card-item-title"
                                    >
                                        {t(`mission.items.${key}.title`)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="card-item-description"
                                    >
                                        {t(`mission.items.${key}.description`)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Box className="dark-quote-block">
                    <Stack spacing={2} alignItems="center">
                        <Box aria-hidden className="quote-decorator">
                            <FormatQuote fontSize="large" />
                        </Box>
                        <Typography variant="body1" className="dark-quote-text">
                            {t("mission.closingQuote")}
                        </Typography>
                        <Typography variant="caption" className="dark-quote-author">
                            {t("mission.closingQuoteAuthor")}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default CommitteInvitationOurMission;
