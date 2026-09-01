import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import CheckboxOptionGroup from "../molecules/CheckboxOptionGroup";
import {
    AVAILABILITY_OPTIONS,
    CONTRIBUTION_OPTIONS,
    FormState,
    INTEREST_AREA_OPTIONS,
    ListField,
    MOTIVATION_MAX_LENGTH,
} from "../CommitteInvitationConstants";

interface ContributionStepProps {
    form: FormState;
    errors: Record<string, boolean>;
    setField: <K extends keyof FormState>(
        field: K
    ) => (value: FormState[K]) => void;
    toggleListField: (field: ListField, value: string) => void;
}

const ContributionStep = ({
    form,
    errors,
    setField,
    toggleListField,
}: ContributionStepProps) => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box>
            <Typography variant="subtitle1" className="form-step-title">
                {t("form.steps.contribution")}
            </Typography>
            <Typography variant="body2" className="form-step-description">
                {t("form.contribution.description")}
            </Typography>

            <CheckboxOptionGroup
                sx={{ mt: 3 }}
                label={t("form.contribution.interestAreasLabel")}
                options={INTEREST_AREA_OPTIONS}
                selected={form.interestAreas}
                getOptionLabel={(option) =>
                    t(`form.interestAreaOptions.${option}`)
                }
                onToggle={(option) =>
                    toggleListField("interestAreas", option)
                }
            />

            <CheckboxOptionGroup
                sx={{ mt: 2 }}
                label={t("form.contribution.contributionLabel")}
                options={CONTRIBUTION_OPTIONS}
                selected={form.contributionTypes}
                getOptionLabel={(option) =>
                    t(`form.contributionOptions.${option}`)
                }
                onToggle={(option) =>
                    toggleListField("contributionTypes", option)
                }
            />

            <CheckboxOptionGroup
                sx={{ mt: 2 }}
                label={t("form.contribution.availabilityLabel")}
                options={AVAILABILITY_OPTIONS}
                selected={form.availability}
                getOptionLabel={(option) =>
                    t(`form.availabilityOptions.${option}`)
                }
                onToggle={(option) => toggleListField("availability", option)}
            />

            <TextField
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 2 }}
                label={t("form.contribution.priorExperience")}
                value={form.priorExperience}
                onChange={(event) =>
                    setField("priorExperience")(event.target.value)
                }
            />

            <TextField
                fullWidth
                required
                multiline
                rows={4}
                sx={{ mt: 2 }}
                label={t("form.contribution.motivation")}
                value={form.motivation}
                error={!!errors.motivation}
                inputProps={{ maxLength: MOTIVATION_MAX_LENGTH }}
                helperText={`${form.motivation.length} / ${MOTIVATION_MAX_LENGTH}`}
                onChange={(event) =>
                    setField("motivation")(event.target.value)
                }
            />
        </Box>
    );
};

export default ContributionStep;
