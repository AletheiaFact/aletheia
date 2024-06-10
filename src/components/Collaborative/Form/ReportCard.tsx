import React from "react";
import { useTranslation } from "next-i18next";
import EditorCard from "./EditorCard";

const ReportCard = ({ forwardRef }) => {
    const { t } = useTranslation();
    return (
        <EditorCard
            label={t("claimReviewForm:reportLabel")}
            dataCy="testClaimReviewreport"
            forwardRef={forwardRef}
        />
    );
};

export default ReportCard;
