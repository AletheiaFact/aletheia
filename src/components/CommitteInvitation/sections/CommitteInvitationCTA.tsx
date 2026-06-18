import React from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import {
    ArrowForward,
    HubOutlined,
    LibraryBooksOutlined,
    VerifiedUserOutlined,
    SupportAgentOutlined,
    CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import { trackUmamiEvent } from "../../../lib/umami";

const checklistItems = [
    "checklist.item1",
    "checklist.item2",
    "checklist.item3",
    "checklist.item4",
];

const iconItems = [
    { key: "network", icon: <HubOutlined fontSize="small" /> },
    { key: "materials", icon: <LibraryBooksOutlined fontSize="small" /> },
    { key: "certification", icon: <VerifiedUserOutlined fontSize="small" /> },
    { key: "support", icon: <SupportAgentOutlined fontSize="small" /> },
];

const CommitteInvitationCTA = () => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box className="cta-wrapper" id="join">
            <Box className="container-section">
                <Stack spacing={2} alignItems="center">
                    <Typography variant="overline" className="section-eyebrow">
                        {t("cta.eyebrow")}
                    </Typography>
                    <Typography variant="h2" className="cta-title">
                        {t("cta.title")}
                    </Typography>
                    <Typography variant="body1" className="cta-description">
                        {t("cta.description")}
                    </Typography>
                </Stack>

                <Box className="cta-card">
                    <Grid container>
                        <Grid item xs={12} md={7}>
                            <Box className="cta-card-left">
                                <Typography
                                    variant="h6"
                                    className="cta-who-can-join-title"
                                >
                                    {t("cta.whoCanJoin.title")}
                                </Typography>
                                <Stack spacing={0.5} sx={{ mt: 2, mb: 4 }}>
                                    {checklistItems.map((itemKey) => (
                                        <Box
                                            className="checklist-item"
                                            key={itemKey}
                                        >
                                            <CheckCircleOutlineOutlined className="cta-checklist-icon" />
                                            <Typography
                                                variant="body2"
                                                className="cta-checklist-item-text"
                                            >
                                                {t(`cta.${itemKey}`)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={2}>
                                    {iconItems.map(({ key, icon }) => (
                                        <Grid item xs={6} sm={3} key={key}>
                                            <Stack
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <Box className="benefit-icon-wrapper">
                                                    {icon}
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    className="cta-icon-label"
                                                >
                                                    {t(`cta.iconLabels.${key}`)}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Box className="cta-card-right">
                                <Stack spacing={3}>
                                    <Box>
                                        <Chip
                                            icon={
                                                <Box
                                                    component="span"
                                                    className="badge-dot"
                                                />
                                            }
                                            label={t("cta.badge")}
                                            size="small"
                                            className="hero-chip"
                                        />
                                        <Typography
                                            variant="h5"
                                            className="cta-form-title"
                                        >
                                            {t("cta.formTitle")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="cta-form-description"
                                        >
                                            {t("cta.formDescription")}
                                        </Typography>
                                    </Box>

                                    <Button
                                        onClick={() =>
                                            trackUmamiEvent(
                                                "cta-committee-invitation-button",
                                                "committee-invitation"
                                            )
                                        }
                                        href="https://forms.gle/AnTuCzXtPTrsXHGVA"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        fullWidth
                                        sx={{
                                            bgcolor: colors.lightPrimary,
                                            color: colors.white,
                                            px: 2.5,
                                            py: 1.25,
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            borderRadius: "6px",
                                            "&:hover": {
                                                bgcolor: colors.lightSecondary,
                                            },
                                        }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        component="a"
                                    >
                                        {t("cta.formButton")}
                                    </Button>

                                    <Typography
                                        variant="body2"
                                        className="cta-contact-text"
                                    >
                                        {t("cta.orContact")}{" "}
                                        <Link
                                            href="mailto:contato@aletheiafact.org"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            component="a"
                                            className="cta-contact-link"
                                        >
                                            contato@aletheiafact.org
                                        </Link>
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default CommitteInvitationCTA;
