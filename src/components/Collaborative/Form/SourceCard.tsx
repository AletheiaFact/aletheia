import React from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import CardStyle from "./CardStyle";
import { useTranslation } from "next-i18next";

const SourceCard = ({ forwardRef }) => {
    const { t } = useTranslation();

    return (
        <CardStyle>
            <label>{t("claimReviewForm:sourcesLabel")}</label>
            <Col span={24} style={{ display: "flex", position: "initial" }}>
                <Col span={24} className="card-container">
                    <div
                        className="card-content"
                        data-cy="testSourceReviewSourceInput"
                        style={{
                            minHeight: "40px",
                        }}
                    >
                        <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                    </div>
                </Col>
            </Col>
        </CardStyle>
    );
};

export const getSourceContentHtml = () => `
    <div data-source-id="${uniqueId()}">
        <p></p>
    </div>`;

export default SourceCard;
