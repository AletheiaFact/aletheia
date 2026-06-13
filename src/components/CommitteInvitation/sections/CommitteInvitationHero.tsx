import React from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { ArrowForward, FormatQuoteOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import AletheiaAvatar from "../../AletheiaAvatar";

const CommitteInvitationHero = () => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box className="hero-wrapper">
            <Box className="container-section">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Chip
                            icon={<Box component="span" className="badge-dot" />}
                            label={t("hero.chip")}
                            size="small"
                            className="hero-chip"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h1" className="hero-title">
                                    {t("hero.title")}
                                </Typography>
                                <Typography variant="body1" className="hero-description">
                                    {t("hero.description")}
                                </Typography>
                            </Box>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                            >
                                <Button
                                    variant="contained"
                                    size="medium"
                                    endIcon={<ArrowForward fontSize="small" />}
                                    sx={{
                                        bgcolor: colors.lightPrimary,
                                        color: colors.white,
                                        px: 2.5,
                                        py: 1.25,
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        borderRadius: "6px",
                                        "&:hover": { bgcolor: colors.lightSecondary },
                                    }}
                                    href="#join"
                                    component="a"
                                >
                                    {t("hero.ctaPrimary")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        px: 2.5,
                                        py: 1.25,
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        borderRadius: "6px",
                                        color: colors.primary,
                                        borderColor: colors.neutralTertiary,
                                        "&:hover": {
                                            borderColor: colors.primary,
                                            bgcolor: colors.lightTertiary,
                                        },
                                    }}
                                    href="#mission"
                                    component="a"
                                >
                                    {t("hero.ctaSecondary")}
                                </Button>
                            </Stack>

                            <Divider />

                            <Stack direction="row" spacing={{ xs: 2, sm: 5 }}>
                                <Box className="stat-item">
                                    <Typography variant="h5" className="stat-value">
                                        {t("hero.stat1Value")}
                                    </Typography>
                                    <Typography variant="caption" className="stat-label">
                                        {t("hero.stat1Label")}
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box className="stat-item">
                                    <Typography variant="h5" className="stat-value">
                                        {t("hero.stat2Value")}
                                    </Typography>
                                    <Typography variant="caption" className="stat-label">
                                        {t("hero.stat2Label")}
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box className="stat-item">
                                    <Typography variant="h5" className="stat-value">
                                        {t("hero.stat3Value")}
                                    </Typography>
                                    <Typography variant="caption" className="stat-label">
                                        {t("hero.stat3Label")}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box className="quote-card">
                            <Stack spacing={2.5}>
                                <Box aria-hidden className="quote-decorator">
                                    <FormatQuoteOutlined fontSize="large" />
                                </Box>

                                <Typography variant="body1" className="quote-text">
                                    {t("hero.quote")}
                                </Typography>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
                                    sx={{ pt: 0.5 }}
                                >
                                    <AletheiaAvatar
                                        size={30}
                                        src="/android-chrome-192x192.png"
                                        alt="aletheia avatar"
                                    />
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            className="quote-author-name"
                                        >
                                            {t("hero.quoteAuthor")}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            className="quote-author-source"
                                        >
                                            {t("hero.quoteSource")}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CommitteInvitationHero;
