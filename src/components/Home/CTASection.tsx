import { Col } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import { isUserLoggedIn } from "../../atoms/currentUser";

import { trackUmamiEvent } from "../../lib/umami";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import CtaSectionStyle from "./CTASection.style";

const CTASection = () => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);

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
                                "home-header-cta-registration-button",
                                "registration"
                            );
                        }}
                        href={"/sign-up"}
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
