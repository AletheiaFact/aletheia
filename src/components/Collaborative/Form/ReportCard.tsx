import React from "react";
import EditorCard from "./EditorCard";
import { useTranslations } from "next-intl";

const ReportCard = ({ forwardRef }) => {
    const tClaimReviewForm = useTranslations("claimReviewForm");
    return (
        <EditorCard
            label={tClaimReviewForm("reportLabel")}
            dataCy="testClaimReviewreport"
            forwardRef={forwardRef}
        />
    );
};

export default ReportCard;
