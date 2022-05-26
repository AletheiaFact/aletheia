import React from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'next-i18next';

const HomeStats = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <Row className="stats-container">
            <Col
                span={7}
                className="stats-child-container"
            >
                <p className="stats-text">
                    <span className="number-stats">
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
                <p className="stats-text">
                    <span className="number-stats">
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
                <p className="stats-text">
                    <span className="number-stats">
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