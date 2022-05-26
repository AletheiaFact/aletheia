import React from 'react'
import { Row, Col } from 'antd'
import Button, { ButtonType } from '../Button';
import { useTranslation } from 'next-i18next';
import colors from '../../styles/colors';

const CTASection = ({ isLoggedIn }) => {
    const { t } = useTranslation();

    return (
        <Row className="CTA-section">
            <Col
                span={14}
                className="home-footer-title-container"
            >
                <h2 className="home-footer-title">
                    {t("home:statsFooter")}
                </h2>
            </Col>
            {!isLoggedIn &&
                <Row
                    style={{
                        height: "15%",
                        color: colors.white,
                        justifyContent: "space-between",
                        marginBottom: "32px",
                    }}
                    gutter={3}
                >
                    <Col className="create-account-container">
                        <Button
                            href="#create_account"
                            type={ButtonType.white}
                            className="create-account-button"
                        >
                            <span style={{ fontWeight: 700 }}>
                                {t("home:createAccountButton")}
                            </span>
                        </Button>
                    </Col>
                </Row>
            }
        </Row>
    )
}

export default CTASection