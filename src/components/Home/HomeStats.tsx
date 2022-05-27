import React from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'next-i18next';
import colors from '../../styles/colors';

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
            >
                <p
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 0,
                    }}
                >
                    <span
                        className="number-stats"
                        style={{
                            color: colors.lightBlueSecondary,
                            lineHeight: "55px",
                            marginRight: "20px",
                        }}
                    >
                        {stats.personalities}
                    </span>{" "}
                    <span className="title-stats">
                        {t("home:statsPersonalities")}
                    </span>
                </p>
            </Col>
            <Col
                span={7}
                offset={2}
                className="stats-child-container"
            >
                <p
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 0,
                    }}
                >
                    <span
                        className="number-stats"
                        style={{
                            color: colors.lightBlueSecondary,
                            lineHeight: "55px",
                            marginRight: "20px",
                        }}
                    >
                        {stats.claims}
                    </span>{" "}
                    <span className="title-stats">
                        {t("home:statsClaims")}
                    </span>
                </p>
            </Col>
            <Col
                span={7}
                offset={1}
                className="stats-child-container"
            >
                <p
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 0,
                    }}
                >
                    <span
                        className="number-stats"
                        style={{
                            color: colors.lightBlueSecondary,
                            lineHeight: "55px",
                            marginRight: "20px",
                        }}
                    >
                        {stats.reviews}
                    </span>{" "}
                    <span className="title-stats">
                        {t("home:statsClaimReviews")}
                    </span>
                </p>
            </Col>
        </Row>
    )
}

export default HomeStats