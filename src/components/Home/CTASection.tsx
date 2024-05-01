import { Col } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import { isUserLoggedIn } from "../../atoms/currentUser";

import { trackUmamiEvent } from "../../lib/umami";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import CtaSectionStyle from "./CTASection.style";
import DonateButton from "../Header/DonateButton";
import { useAppSelector } from "../../store/store";

const CTASection = () => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const { vw } = useAppSelector((state) => state);

    return (
        <CtaSectionStyle>
            <Col
                xs={isLoggedIn ? 24 : 16}
                sm={12}
                md={24}
                className="footer-text"
            >
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
            <Col xs={8} md={24} className="CTA-button-container">
                {!isLoggedIn && (
                    <Col sm={24} md={12}>
                        <Button
                            onClick={() => {
                                trackUmamiEvent(
                                    "home-header-cta-registration-button",
                                    "registration"
                                );
                            }}
                            href={"/sign-up"}
                            type={ButtonType.white}
                            style={{
                                height: "auto",
                                minHeight: "40px",
                                lineHeight: "inherit",
                                textWrap: "wrap",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: " 100%",
                                padding: "0 20px",
                                whiteSpace: "normal",
                                fontSize: vw?.md && !vw?.sm ? "12px" : "14px",
                            }}
                        >
                            <span style={{ fontWeight: 700 }}>
                                {t("home:createAccountButton")}
                            </span>
                        </Button>
                    </Col>
                )}
                {!vw?.sm && (
                    <Col sm={11} md={isLoggedIn ? 14 : 11}>
                        <DonateButton
                            style={{ fontSize: vw?.md ? "12px" : "14px" }}
                        />
                    </Col>
                )}
            </Col>
        </CtaSectionStyle>
    );
};

export default CTASection;
