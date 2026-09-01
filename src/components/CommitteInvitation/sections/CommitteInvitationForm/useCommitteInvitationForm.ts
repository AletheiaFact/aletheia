import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { getRegionByUf, getStateLabel } from "../../../../utils/brazilRegions";
import { trackUmamiEvent } from "../../../../lib/umami";
import CommitteeInterestApi from "../../../../api/committeeInterestApi";
import {
    FormState,
    INITIAL_STATE,
    ListField,
    REQUIRED_FIELDS_BY_STEP,
    STEP_KEYS,
} from "./CommitteInvitationConstants";
import { isPhoneValid } from "./phoneUtils";

export const useCommitteInvitationForm = () => {
    const { t } = useTranslation("committeeInvitation");
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<FormState>(INITIAL_STATE);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [recaptcha, setRecaptcha] = useState("");

    const region = useMemo(
        () => (form.country === "Brasil" ? getRegionByUf(form.uf) : undefined),
        [form.country, form.uf]
    );

    const setField = <K extends keyof FormState>(field: K) => (
        value: FormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const toggleListField = (field: ListField, value: string) => {
        setForm((prev) => {
            const list = prev[field];
            const next = list.includes(value)
                ? list.filter((item) => item !== value)
                : [...list, value];
            return { ...prev, [field]: next };
        });
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const validateStep = () => {
        const fields = REQUIRED_FIELDS_BY_STEP[step];
        const nextErrors: Record<string, boolean> = {};
        fields.forEach((field) => {
            const value = form[field];
            const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
            if (isEmpty) nextErrors[field] = true;
        });
        if (
            fields.includes("phone") &&
            !nextErrors.phone &&
            !isPhoneValid(form.phone, form.country)
        ) {
            nextErrors.phone = true;
        }
        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        trackUmamiEvent(
            `committee-invitation-form-step-${step + 1}-completed`,
            "committee-invitation"
        );
        setStep((current) => Math.min(current + 1, STEP_KEYS.length - 1));
    };

    const handleBack = () => setStep((current) => Math.max(current - 1, 0));

    const handleSubmit = async () => {
        if (!validateStep() || !recaptcha || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await CommitteeInterestApi.submitApplication({
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                city: form.city,
                state: form.uf ? getStateLabel(form.uf) : "",
                country: form.country,
                region: region ?? "",
                actingAs: form.actingAs
                    ? t(`form.actingAsOptions.${form.actingAs}`)
                    : "",
                institution: form.institution,
                role: form.role,
                interestAreas: form.interestAreas
                    .map((option) => t(`form.interestAreaOptions.${option}`))
                    .join(", "),
                contributionTypes: form.contributionTypes
                    .map((option) => t(`form.contributionOptions.${option}`))
                    .join(", "),
                availability: form.availability
                    .map((option) => t(`form.availabilityOptions.${option}`))
                    .join(", "),
                priorExperience: form.priorExperience,
                motivation: form.motivation,
                consentData: true,
                consentComms: true,
                recaptcha,
            }, t);

            trackUmamiEvent(
                "committee-invitation-form-submitted",
                "committee-invitation"
            );
            setSubmitted(true);
        } catch (error) {
            // Error toast already shown by CommitteeInterestApi.submitApplication.
            console.error("Error submitting committee interest form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setForm(INITIAL_STATE);
        setErrors({});
        setRecaptcha("");
        setStep(0);
        setSubmitted(false);
    };

    return {
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
    };
};
