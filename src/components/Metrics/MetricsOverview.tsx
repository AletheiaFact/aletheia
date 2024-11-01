import React from "react";
import ReviewStats from "./ReviewStats";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

const MetricsOverview = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <Row>
            <Col
                style={{
                    width: "100%",
                    color: colors.blackTertiary,
                }}
                offset={2}
                span={18}
            >
                {stats?.reviews && stats?.reviews.length > 0 ? (
                    <div>
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: "20px",
                                fontWeight: 700,
                                color: colors.blackSecondary,
                                marginBottom: 0,
                            }}
                        >
                            {t("metrics:headerTitle")}
                        </p>
                        <p
                            style={{
                                fontSize: 14,
                                lineHeight: "22px",
                                color: colors.blackSecondary,
                                marginBottom: "16px",
                            }}
                        >
                            {t("metrics:header")}
                        </p>
                    </div>
                ) : (
                    t("metrics:empytOverview")
                )}
                <ReviewStats stats={stats} countInTitle={true} type="line" />
            </Col>
        </Row>
    );
};

export default MetricsOverview;
