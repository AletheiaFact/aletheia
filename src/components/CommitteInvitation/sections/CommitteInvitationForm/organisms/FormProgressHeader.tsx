import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import FormProgressStep from "../molecules/FormProgressStep";
import { STEP_KEYS } from "../CommitteInvitationConstants";

interface FormProgressHeaderProps {
    step: number;
}

const FormProgressHeader = ({ step }: FormProgressHeaderProps) => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h5" className="form-title">
                        {t("form.title")}
                    </Typography>
                    <Typography variant="body2" className="form-subtitle">
                        {t("form.subtitle")}
                    </Typography>
                </Box>
                <Typography variant="body2" className="form-step-count">
                    {t("form.stepCount", {
                        current: step + 1,
                        total: STEP_KEYS.length,
                    })}
                </Typography>
            </Stack>

            <Grid container spacing={1} className="form-progress" sx={{ mt: 3 }}>
                {STEP_KEYS.map((key, index) => (
                    <FormProgressStep
                        key={key}
                        label={t(`form.steps.${key}`)}
                        active={index <= step}
                        completed={index < step}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default FormProgressHeader;
