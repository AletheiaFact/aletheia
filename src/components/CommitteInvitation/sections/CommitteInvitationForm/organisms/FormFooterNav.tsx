import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowBack, ArrowForward, Send } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { STEP_FIELD_COUNTS, STEP_KEYS } from "../CommitteInvitationConstants";

interface FormFooterNavProps {
    step: number;
    canSubmit: boolean;
    isSubmitting?: boolean;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

const FormFooterNav = ({
    step,
    canSubmit,
    isSubmitting,
    onBack,
    onNext,
    onSubmit,
}: FormFooterNavProps) => {
    const { t } = useTranslation("committeeInvitation");
    const isLastStep = step === STEP_KEYS.length - 1;

    return (
        <Box className="form-footer">
            <Button
                variant="text"
                startIcon={<ArrowBack />}
                disabled={step === 0}
                onClick={onBack}
            >
                {t("form.backButton")}
            </Button>


            <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" className="form-field-count">
                    {isLastStep
                        ? t("form.lastStep")
                        : t("form.fieldCount", {
                            count: STEP_FIELD_COUNTS[step],
                        })}
                </Typography>

                {isLastStep ? (
                    <Button
                        variant="contained"
                        endIcon={
                            isSubmitting ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <Send />
                            )
                        }
                        disabled={!canSubmit || isSubmitting}
                        onClick={onSubmit}
                    >
                        {t("form.submitButton")}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={onNext}
                    >
                        {t("form.continueButton")}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default FormFooterNav;
