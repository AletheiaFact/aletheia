import { useTranslation } from "next-i18next";
import React from "react";
import { Typography } from "antd";
import Button, { ButtonType } from "../Button";
import CTARegistrationStyle from "./CTARegistration.style";
import colors from "../../styles/colors";

function CTARegistration() {
    const { t } = useTranslation();

    return (
        <CTARegistrationStyle
            style={{
                backgroundColor: colors.bluePrimary,
                textAlign: "center",
                maxWidth: "100%",
                display: "grid",
                justifyContent: "center",
            }}
        >
            <p
                style={{
                    width: "100%",
                    color: colors.white,
                    fontSize: "22px",
                    lineHeight: "34px",
                    fontWeight: 800,
                    marginBottom: 0,
                }}
            >
                {t("CTARegistration:title")}
            </p>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "0 16px 0 16px",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    margin: "32px 0 13px 0",
                }}
            >
                {t("CTARegistration:body")}
            </p>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "0 16px 0 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "22px",
                    marginBottom: "32px",
                }}
            >
                {t("CTARegistration:footer")}
            </p>
            <Button
                onClick={() => {
                    umami?.trackEvent(
                        "cta-registration-button",
                        "registration"
                    );
                }}
                type={ButtonType.white}
                target="_blank"
                rounded
                href={t("common:registrationLink")}
                className="CTA-registration-button"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40px",
                    padding: "0 15px",
                    fontWeight: 700,
                }}
            >
                {t("CTARegistration:button")}
            </Button>
        </CTARegistrationStyle>
    );
}

export default CTARegistration;
