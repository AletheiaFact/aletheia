import React from "react";
import EditorCard from "./EditorCard";
import { useTranslations } from "next-intl";

const VerificationCard = ({ forwardRef }) => {
    const tClaimReviewForm = useTranslations("claimReviewForm");
    return (
        <EditorCard
            label={tClaimReviewForm("verificationLabel")}
            dataCy="testClaimReviewverification"
            forwardRef={forwardRef}
        />
    );
};

export default VerificationCard;
