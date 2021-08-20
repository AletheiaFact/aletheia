import React, { Component } from "react";
import ReviewStats from "./ReviewStats";
import { Col, Row, Typography } from "antd";
import { withTranslation } from "react-i18next";

const { Title } = Typography;

class MetricsOverview extends Component {
    render() {
        const { stats, t } = this.props;
        return (
            <Row style={{ background: "white" }}>
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
                            <span>{t("metrics:header", stats)}</span>
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
}

export default withTranslation()(MetricsOverview);
