import React from 'react'
import { Row, Col } from 'antd'
import Button, { ButtonType } from '../Button';
import { useTranslation } from 'next-i18next';
import colors from '../../styles/colors';

const CTASection = ({ isLoggedIn }) => {
    const { t } = useTranslation();

    return (
        <Row className="CTA-container">
            <Col span={14}>
                <h2
                    className="CTA-title"
                    style={{
                        lineHeight: "20px",
                        color: colors.white,
                        marginBottom: 0,
                    }}
                >
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
                    <Col className="CTA-button-container">
                        <Button
                            href="#create_account"
                            type={ButtonType.white}
                            className="CTA-button"
                            rounded
                            style={{
                                height: "40px",
                                display: "flex",
                                padding: 0,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
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
