import React, { useContext } from "react";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { ReportModelEnum } from "../../../machines/reviewTask/enums";
import EditorCard from "./EditorCard";
import { useTranslations } from "next-intl";

const SummaryCard = ({ forwardRef }) => {
    const tClaimReviewForm = useTranslations("claimReviewForm");
    const { reportModel } = useContext(ReviewTaskMachineContext);
    const label =
        reportModel === ReportModelEnum.InformativeNews
            ? tClaimReviewForm("informativeNewsLabel")
            : tClaimReviewForm("summaryLabel");

    return (
        <EditorCard
            label={label}
            dataCy="testClaimReviewsummary"
            forwardRef={forwardRef}
        />
    );
};

export default SummaryCard;
