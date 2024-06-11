import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { ReportModelEnum } from "../../../machines/reviewTask/enums";
import EditorCard from "./EditorCard";

const SummaryCard = ({ forwardRef }) => {
    const { t } = useTranslation();
    const { reportModel } = useContext(ReviewTaskMachineContext);
    const label =
        reportModel === ReportModelEnum.InformativeNews
            ? t("claimReviewForm:informativeNewsLabel")
            : t("claimReviewForm:summaryLabel");

    return (
        <EditorCard
            label={label}
            dataCy="testClaimReviewsummary"
            forwardRef={forwardRef}
        />
    );
};

export default SummaryCard;
