import React from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";

export const ReportCard = ({ forwardRef, node }) => {
    const { t } = useTranslation();
    return (
        <CardStyle>
            <label>{t("claimReviewForm:reportLabel")}</label>
            <Col span={24} className="card-container">
                <div className="card-content" data-cy="testClaimReviewreport">
                    <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                </div>
            </Col>
        </CardStyle>
    );
};

export const getReportContentHtml = () => `
    <div
        data-report-id="${uniqueId()}"
    >
        <p></p>
    </div>`;
