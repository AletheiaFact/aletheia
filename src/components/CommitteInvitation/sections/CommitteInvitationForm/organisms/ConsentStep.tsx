import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import AletheiaCaptcha from "../../../../AletheiaCaptcha";
import ConsentCheckboxItem from "../molecules/ConsentCheckboxItem";
import SummaryField from "../molecules/SummaryField";
import { FormState } from "../CommitteInvitationConstants";

interface ConsentStepProps {
    form: FormState;
    errors: Record<string, boolean>;
    region?: string;
    setField: <K extends keyof FormState>(
        field: K
    ) => (value: FormState[K]) => void;
    setRecaptcha: (value: string) => void;
}

const ConsentStep = ({
    form,
    errors,
    region,
    setField,
    setRecaptcha,
}: ConsentStepProps) => {
    const { t } = useTranslation("committeeInvitation");

    return (
        <Box>
            <Typography variant="subtitle1" className="form-step-title">
                {t("form.steps.consent")}
            </Typography>
            <Typography variant="body2" className="form-step-description">
                {t("form.consent.description")}
            </Typography>

            <ConsentCheckboxItem
                sx={{ mt: 2 }}
                checked={form.consentData}
                error={!!errors.consentData}
                lead={t("form.consent.dataLead")}
                description={t("form.consent.dataDescription")}
                onChange={(checked) => setField("consentData")(checked)}
            />

            <ConsentCheckboxItem
                checked={form.consentComms}
                error={!!errors.consentComms}
                lead={t("form.consent.commsLead")}
                description={t("form.consent.commsDescription")}
                onChange={(checked) => setField("consentComms")(checked)}
            />

            <Box className="summary-box">
                <Typography variant="overline" className="summary-title">
                    {t("form.consent.summaryTitle")}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <SummaryField
                        label={t("form.consent.summaryName")}
                        value={form.fullName}
                    />
                    <SummaryField
                        label={t("form.consent.summaryEmail")}
                        value={form.email}
                    />
                    <SummaryField
                        label={t("form.consent.summaryProfile")}
                        value={
                            form.actingAs
                                ? t(`form.actingAsOptions.${form.actingAs}`)
                                : ""
                        }
                    />
                    <SummaryField
                        label={t("form.consent.summaryRegion")}
                        value={
                            region ? t("form.regionLabel", { region }) : ""
                        }
                    />
                </Grid>
            </Box>

            <Box sx={{ mt: 3 }}>
                <AletheiaCaptcha onChange={setRecaptcha} />
            </Box>
        </Box>
    );
};

export default ConsentStep;
