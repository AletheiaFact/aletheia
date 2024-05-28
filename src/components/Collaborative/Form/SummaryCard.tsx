import React, { useContext } from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { ReportModelEnum } from "../../../machines/reviewTask/enums";

export const SummaryCard = ({ forwardRef, node }) => {
    const { reportModel } = useContext(ReviewTaskMachineContext);
    const { t } = useTranslation();
    return (
        <CardStyle>
            <label>
                {reportModel === ReportModelEnum.InformativeNews
                    ? t("claimReviewForm:informativeNewsLabel") //TODO: Remove this conditional when editor fields is configurabled by namespaces
                    : t("claimReviewForm:summaryLabel")}
            </label>
            <Col span={24} className="card-container">
                <div className="card-content" data-cy="testClaimReviewsummary">
                    <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                </div>
            </Col>
        </CardStyle>
    );
};

export const getSummaryContentHtml = () => `
    <div data-summary-id="${uniqueId()}">
        <p></p>
    </div>`;
