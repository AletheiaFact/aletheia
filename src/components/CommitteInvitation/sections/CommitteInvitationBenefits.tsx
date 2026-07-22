import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import {
    VerifiedUserOutlined,
    LibraryBooksOutlined,
    ScienceOutlined,
    SupportAgentOutlined,
    VisibilityOutlined,
    AssessmentOutlined,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";

const benefitItems = [
    { key: "certification", icon: <VerifiedUserOutlined /> },
    { key: "materials", icon: <LibraryBooksOutlined /> },
    { key: "research", icon: <ScienceOutlined /> },
    { key: "support", icon: <SupportAgentOutlined /> },
    { key: "visibility", icon: <VisibilityOutlined /> },
    { key: "reports", icon: <AssessmentOutlined /> },
];

const CommitteInvitationBenefits = () => {
    const t = useTranslations("committeeInvitation");

    return (
        <Box className="benefits-wrapper">
            <Box className="container-section">
                <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
                    <Typography variant="overline" className="section-eyebrow">
                        {t("benefits.eyebrow")}
                    </Typography>
                    <Typography variant="h2" className="section-title">
                        {t("benefits.title")}
                    </Typography>
                    <Typography variant="body1" className="section-description">
                        {t("benefits.description")}
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {benefitItems.map(({ key, icon }) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                            <Stack className="benefit-card" direction="row" spacing={2}>
                                <Box className="benefit-icon-wrapper">{icon}</Box>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        className="card-item-title"
                                    >
                                        {t(`benefits.items.${key}.title`)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="card-item-description"
                                    >
                                        {t(`benefits.items.${key}.description`)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Box className="pact-box">
                    <Stack spacing={1.5}>
                        <Typography variant="subtitle1" className="pact-title">
                            {t("benefits.pact.title")}
                        </Typography>
                        <Typography variant="body2" className="pact-description">
                            {t("benefits.pact.description")}
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default CommitteInvitationBenefits;
