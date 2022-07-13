import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";

function NewCTARegistration({ style = {} }) {
    const { t } = useTranslation();

    return (
            <Row
                style={{
                    backgroundColor: colors.graySecondary,
                    textAlign: "center",
                    padding: "100px 20px 20px 20px",
                    margin: "0px -5px",
                    display: "grid",
                    justifyContent: "center",
                    ...style,
                }}
            >
                <Col
                    style={{
                        color: "#fff",
                        fontSize: "18px",
                        fontWeight: 600,
                        lineHeight: "21px",
                        textAlign: "center",
                    }}
                >
                    {t(
                        "AletheiaFact.org é um movimento e plataforma coletivo de verificação de fatos que imagina uma sociedade onde todos podem ter"
                    )}
                </Col>
                <Col xs={0} sm={0} md={24}>
                    <Button
                        onClick={() => {
                            umami?.trackEvent(
                                "cta-registration-button",
                                "registration"
                            );
                        }}
                        type={ButtonType.blue}
                        target="_blank"
                        href={t("common:registrationLink")}
                        className="New-CTA-registration-button"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height: "40px",
                            marginTop: "20px",
                            padding: "0 15px",
                            fontWeight: 700,
                        }}
                    >
                        {t("CTARegistration:button")}
                    </Button>
                </Col>
            </Row>
    );
}

export default NewCTARegistration;
