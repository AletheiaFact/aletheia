import React from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import {
    CheckCircle,
    LocationOnOutlined,
    ReplayOutlined,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";

interface SuccessScreenProps {
    region?: string;
    onReset: () => void;
}

const TIMELINE_KEYS = ["first", "second", "third"];

const SuccessScreen = ({ region, onReset }: SuccessScreenProps) => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box className="form-card success-card">
            <Box className="success-header">
                <CheckCircle className="success-icon" />
                <Typography variant="h5" className="success-title">
                    {t("form.success.title")}
                </Typography>
                <Typography variant="body2" className="success-description">
                    {t("form.success.description")}
                </Typography>
                {region && (
                    <Chip
                        icon={<LocationOnOutlined />}
                        label={t("form.success.linkedRegion", { region })}
                        className="success-chip"
                    />
                )}
            </Box>

            <Box className="success-body">
                <Typography variant="subtitle2" className="success-next-title">
                    {t("form.success.whatHappensNow")}
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {TIMELINE_KEYS.map((key) => (
                        <Grid item xs={12} md={4} key={key}>
                            <Typography
                                variant="subtitle2"
                                className="success-timeline-label"
                            >
                                {t(`form.success.timeline.${key}.label`)}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="success-timeline-description"
                            >
                                {t(`form.success.timeline.${key}.description`)}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                <Box className="success-footer">
                    <Typography
                        variant="body2"
                        className="success-contact-text"
                    >
                        {t("form.success.questions")}{" "}
                        <Box
                            component="a"
                            href="mailto:contato@aletheiafact.org"
                            className="cta-contact-link"
                        >
                            contato@aletheiafact.org
                        </Box>
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ReplayOutlined />}
                        onClick={onReset}
                    >
                        {t("form.success.resetButton")}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default SuccessScreen;
