import React from "react";
import ReviewStats from "./ReviewStats";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";

const { Title } = Typography;

const MetricsOverview = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <Row style={{
            background: "white",
            marginTop: "15px"
        }}>
            <Col
                style={{
                    width: "100%",
                    color: "#262626",
                    padding: "10px 0 25px 0px"
                }}
                offset={2}
                span={18}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "5px"
                    }}
                >
                    <Title level={4}>{t("metrics:headerTitle")}</Title>
                    {stats.totalClaims && (
                        <p style={{ marginBottom: 0 }}>{t("metrics:header", stats)}</p>
                    )}
                </div>
                <ReviewStats
                    stats={stats}
                    countInTitle={true}
                    type="line"
                />
            </Col>
        </Row>
    );
}

export default MetricsOverview;
