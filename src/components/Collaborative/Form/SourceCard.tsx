import React from "react";
import { uniqueId } from "remirror";
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

export const getSourceContentHtml = () => `
    <div data-source-id="${uniqueId()}">
        <p></p>
    </div>`;

export default SourceCard;
