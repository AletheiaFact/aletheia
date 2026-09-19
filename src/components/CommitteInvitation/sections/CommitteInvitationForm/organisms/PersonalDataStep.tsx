import React from "react";
import {
    Box,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { BRAZIL_STATES } from "../../../../../utils/brazilRegions";
import { COUNTRY_OPTIONS, FormState } from "../CommitteInvitationConstants";
import { formatPhoneInput, getPhonePlaceholder } from "../phoneUtils";

interface PersonalDataStepProps {
    form: FormState;
    errors: Record<string, boolean>;
    region?: string;
    setField: <K extends keyof FormState>(
        field: K
    ) => (value: FormState[K]) => void;
}

const PersonalDataStep = ({
    form,
    errors,
    region,
    setField,
}: PersonalDataStepProps) => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box>
            <Typography variant="subtitle1" className="form-step-title">
                {t("form.steps.personal")}
            </Typography>
            <Typography variant="body2" className="form-step-description">
                {t("form.personal.description")}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        required
                        label={t("form.personal.fullName")}
                        value={form.fullName}
                        error={!!errors.fullName}
                        onChange={(event) =>
                            setField("fullName")(event.target.value)
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        required
                        type="email"
                        label={t("form.personal.email")}
                        value={form.email}
                        error={!!errors.email}
                        onChange={(event) =>
                            setField("email")(event.target.value)
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        required
                        type="tel"
                        label={t("form.personal.phone")}
                        placeholder={getPhonePlaceholder(form.country)}
                        value={form.phone}
                        error={!!errors.phone}
                        onChange={(event) =>
                            setField("phone")(
                                formatPhoneInput(
                                    event.target.value,
                                    form.country
                                )
                            )
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        required
                        label={t("form.personal.city")}
                        value={form.city}
                        error={!!errors.city}
                        onChange={(event) =>
                            setField("city")(event.target.value)
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth required error={!!errors.uf}>
                        <InputLabel>{t("form.personal.state")}</InputLabel>
                        <Select
                            label={t("form.personal.state")}
                            value={form.uf}
                            onChange={(event) =>
                                setField("uf")(event.target.value as string)
                            }
                        >
                            {BRAZIL_STATES.map(({ uf, name }) => (
                                <MenuItem key={uf} value={uf}>
                                    {uf} — {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth required error={!!errors.country}>
                        <InputLabel>{t("form.personal.country")}</InputLabel>
                        <Select
                            label={t("form.personal.country")}
                            value={form.country}
                            onChange={(event) =>
                                setField("country")(
                                    event.target.value as string
                                )
                            }
                        >
                            {COUNTRY_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {region && (
                <Box className="region-box">
                    <LocationOnOutlined fontSize="small" />
                    <Typography variant="body2">
                        {t("form.personal.autoRegion")}
                    </Typography>
                    <Chip
                        label={t("form.regionLabel", { region })}
                        className="region-chip"
                    />
                </Box>
            )}
        </Box>
    );
};

export default PersonalDataStep;
