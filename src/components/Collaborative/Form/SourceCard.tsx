import React from "react";
import { useTranslation } from "next-i18next";
import EditorCard from "./EditorCard";

const SourceCard = ({ forwardRef }) => {
    const { t } = useTranslation();

    return (
        <EditorCard
            label={t("claimReviewForm:sourcesLabel")}
            dataCy="testSourceReviewSourceInput"
            span={24}
            forwardRef={forwardRef}
            inputSize={40}
        />
    );
};

export default SourceCard;
