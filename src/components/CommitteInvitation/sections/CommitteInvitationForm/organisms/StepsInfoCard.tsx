import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";

const STEP_ITEM_KEYS = ["interest", "analysis", "alignment", "onboarding"];

const StepsInfoCard = () => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box className="steps-card">
            <Typography variant="subtitle2" className="steps-title">
                {t("steps.title")}
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {STEP_ITEM_KEYS.map((key, index) => (
                    <Grid item xs={12} sm={6} md={3} key={key}>
                        <Box className="step-item">
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box className="step-number">{index + 1}</Box>
                                <Typography variant="subtitle1" className="step-item-title">
                                    {t(`steps.items.${key}.title`)}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" className="step-item-description">
                                {t(`steps.items.${key}.description`)}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StepsInfoCard;
