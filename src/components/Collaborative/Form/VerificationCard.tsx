import React from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";

export const VerificationCard = ({ forwardRef, node }) => {
    const { t } = useTranslation();
    return (
        <CardStyle>
            <label>{t("claimReviewForm:verificationLabel")}</label>
            <Col span={24} className="card-container">
                <div className="card-content">
                    <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                </div>
            </Col>
        </CardStyle>
    );
};

export const getVerificationContentHtml = () => `
    <div data-verification-id="${uniqueId()}">
        <p></p>
    </div>`;
