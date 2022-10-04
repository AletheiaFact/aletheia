import { Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import { trackUmamiEvent } from "../../lib/umami";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import CtaSectionStyle from "./CTASection.style";

const CTASection = () => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));

    return (
        <CtaSectionStyle>
            <Col sm={12} md={24} className="footer-text">
                <p
                    className="CTA-title"
                    style={{
                        lineHeight: "20px",
                        color: colors.white,
                        marginBottom: 0,
                    }}
                >
                    {t("home:statsFooter")}
                </p>
            </Col>
            {!isLoggedIn && (
                <Col sm={6} md={24} className="CTA-button-container">
                    <Button
                        onClick={() => {
                            trackUmamiEvent(
                                "carousel-cta-registration-button",
                                "registration"
                            );
                        }}
                        href={t("common:registrationLink")}
                        target="_blank"
                        rel="noreferrer"
                        type={ButtonType.white}
                        rounded="true"
                        style={{
                            height: "40px",
                            display: "flex",
                            padding: "0 20px",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "fit-content",
                        }}
                    >
                        <span style={{ fontWeight: 700 }}>
                            {t("home:createAccountButton")}
                        </span>
                    </Button>
                </Col>
            )}
        </CtaSectionStyle>
    );
};

export default CTASection;
