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
                    color: colors.blackPrimary,
                    fontSize: "18px",
                    fontStyle: "italic",
                    lineHeight: "22px",
                    textAlign: "center",
                }}
            >
                {t("NewCTARegistration:body")}
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
                    className="new-cta-registration-button"
                    rounded
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: "88px",
                        marginTop: "20px",
                        fontWeight: 900,
                        fontSize: 18,
                        lineHeight: "22px",
                    }}
                >
                    {t("CTARegistration:button")}
                </Button>
            </Col>
        </Row>
    );
}

export default NewCTARegistration;
