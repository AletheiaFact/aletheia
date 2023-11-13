import React from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";

export const SummaryCard = ({ forwardRef, node }) => {
    const { t } = useTranslation();
    return (
        <CardStyle>
            <label>{t("claimReviewForm:summaryLabel")}</label>
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
