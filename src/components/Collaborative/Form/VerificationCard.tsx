import React from "react";
import { useTranslation } from "next-i18next";
import EditorCard from "./EditorCard";

const VerificationCard = ({ forwardRef }) => {
    const { t } = useTranslation();
    return (
        <EditorCard
            label={t("claimReviewForm:verificationLabel")}
            dataCy="testClaimReviewverification"
            forwardRef={forwardRef}
        />
    );
};

export default VerificationCard;
