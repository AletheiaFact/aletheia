import React from "react";
import { Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

const HomeStats = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <Row
            className="stats-container"
            style={{
                color: colors.white,
                width: "100%",
                justifyContent: "space-between",
            }}
        >
            <Col
                span={7}
                className="stats-child-container"
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h3
                    className="number-stats"
                    style={{
                        color: colors.lightBlueSecondary,
                        marginRight: "20px",
                        marginBottom: 0,
                    }}
                >
                    {stats.personalities}
                </h3>{" "}
                <p className="title-stats" style={{ marginBottom: 0 }}>
                    {t("home:statsPersonalities")}
                </p>
            </Col>
            <Col
                span={7}
                className="stats-child-container"
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h3
                    className="number-stats"
                    style={{
                        color: colors.lightBlueSecondary,
                        marginRight: "20px",
                        marginBottom: 0,
                    }}
                >
                    {stats.claims}
                </h3>{" "}
                <p className="title-stats" style={{ marginBottom: 0 }}>
                    {t("home:statsClaims")}
                </p>
            </Col>
            <Col
                span={7}
                className="stats-child-container"
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h3
                    className="number-stats"
                    style={{
                        color: colors.lightBlueSecondary,
                        marginBottom: 0,
                        lineHeight: "55px",
                        marginRight: "20px",
                    }}
                >
                    {stats.reviews}
                </h3>{" "}
                <p className="title-stats" style={{ marginBottom: 0 }}>
                    {t("home:statsClaimReviews")}
                </p>
            </Col>
        </Row>
    );
};

export default HomeStats;
