import React from "react";
import { Box } from "@mui/material";
import { useCommitteInvitationForm } from "./useCommitteInvitationForm";
import StepsInfoCard from "./organisms/StepsInfoCard";
import FormProgressHeader from "./organisms/FormProgressHeader";
import PersonalDataStep from "./organisms/PersonalDataStep";
import ProfileStep from "./organisms/ProfileStep";
import ContributionStep from "./organisms/ContributionStep";
import ConsentStep from "./organisms/ConsentStep";
import FormFooterNav from "./organisms/FormFooterNav";
import SuccessScreen from "./organisms/SuccessScreen";

const CommitteInvitationForm = () => {
    const {
        step,
        submitted,
        isSubmitting,
        form,
        errors,
        recaptcha,
        region,
        setField,
        toggleListField,
        setRecaptcha,
        handleNext,
        handleBack,
        handleSubmit,
        handleReset,
    } = useCommitteInvitationForm();

    return (
        <Box className="steps-wrapper" id="form">
            <Box className="container-section">
                <StepsInfoCard />

                {submitted ? (
                    <Box sx={{ mt: 4 }}>
                        <SuccessScreen region={region} onReset={handleReset} />
                    </Box>
                ) : (
                    <Box className="form-card" sx={{ mt: 4 }}>
                        <FormProgressHeader step={step} />

                        <Box className="form-step-content">
                            {step === 0 && (
                                <PersonalDataStep
                                    form={form}
                                    errors={errors}
                                    region={region}
                                    setField={setField}
                                />
                            )}
                            {step === 1 && (
                                <ProfileStep
                                    form={form}
                                    errors={errors}
                                    setField={setField}
                                />
                            )}
                            {step === 2 && (
                                <ContributionStep
                                    form={form}
                                    errors={errors}
                                    setField={setField}
                                    toggleListField={toggleListField}
                                />
                            )}
                            {step === 3 && (
                                <ConsentStep
                                    form={form}
                                    errors={errors}
                                    region={region}
                                    setField={setField}
                                    setRecaptcha={setRecaptcha}
                                />
                            )}
                        </Box>

                        <FormFooterNav
                            step={step}
                            canSubmit={!!recaptcha}
                            isSubmitting={isSubmitting}
                            onBack={handleBack}
                            onNext={handleNext}
                            onSubmit={handleSubmit}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CommitteInvitationForm;
