import React from "react";
import { Box, Grid, Radio, Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import FieldLabel from "../atoms/FieldLabel";
import { ACTING_AS_OPTIONS, ActingAs, FormState } from "../CommitteInvitationConstants";

interface ProfileStepProps {
    form: FormState;
    errors: Record<string, boolean>;
    setField: <K extends keyof FormState>(
        field: K
    ) => (value: FormState[K]) => void;
}

const ProfileStep = ({ form, errors, setField }: ProfileStepProps) => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box>
            <Typography variant="subtitle1" className="form-step-title">
                {t("form.steps.profile")}
            </Typography>
            <Typography variant="body2" className="form-step-description">
                {t("form.profile.description")}
            </Typography>

            <FieldLabel required sx={{ mt: 3 }}>
                {t("form.profile.actingAsLabel")}
            </FieldLabel>
            <Stack
                direction="row"
                flexWrap="wrap"
                spacing={1.5}
                useFlexGap
                sx={{ mt: 1 }}
            >
                {ACTING_AS_OPTIONS.map((option) => (
                    <Box
                        key={option}
                        className={`radio-card ${form.actingAs === option ? "selected" : ""} ${!!errors.actingAs ? "error" : ""
                            }`}
                        onClick={() =>
                            setField("actingAs")(option as ActingAs)
                        }
                    >
                        <Radio size="small" checked={form.actingAs === option} />
                        <Typography variant="body2">{t(`form.actingAsOptions.${option}`)}</Typography>
                    </Box>
                ))}
            </Stack>

            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label={t("form.profile.institution")}
                        value={form.institution}
                        onChange={(event) =>
                            setField("institution")(event.target.value)
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label={t("form.profile.role")}
                        value={form.role}
                        onChange={(event) =>
                            setField("role")(event.target.value)
                        }
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfileStep;
