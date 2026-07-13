import React from "react";
import BaseClaimForm from "./BaseClaimForm";
import { useBaseClaimForm } from "./UseBaseClaimForm";
import { useTranslations } from "next-intl";

const ClaimCreateDebate = () => {
    const tClaimForm = useTranslations("claimForm");
    const {
        handleSubmit, title, setTitle, recaptcha, setRecaptcha, date, setDate, setSources, sources, isLoading, errors, clearError
    } = useBaseClaimForm({ shouldValidateContent: false });

    return (
        <BaseClaimForm
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
            clearError={clearError}
            recaptcha={recaptcha}
            setRecaptcha={setRecaptcha}
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            sources={sources}
            setSources={setSources}
            dateExtraText={tClaimForm("dateFieldHelpDebate")}
        />
    );
};

export default ClaimCreateDebate;
