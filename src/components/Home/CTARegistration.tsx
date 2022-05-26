import { useTranslation } from "next-i18next";
import React from "react";
import { Typography } from "antd";
import Button, { ButtonType } from "../Button";
import CTAContainer from "./CTARegistration.style";

function CTARegistration() {
    const { t } = useTranslation();
    return (
        <CTAContainer>
            <Typography.Title level={2}  className="cta-title">
                {t("CTARegistration:title")}
            </Typography.Title>
            <p className="cta-body-paragraph">
                {t("CTARegistration:body")}
            </p>
            <p className="cta-footer-paragraph">
                {t("CTARegistration:footer")}
            </p>
            <Button
                onClick={() => { umami?.trackEvent('cta-registration-button', 'registration') }}
                type={ButtonType.white}
                target="_blank"
                href={t("common:registrationLink")}
                className="cta-registration-button"
            >
                {t("CTARegistration:button")}
            </Button>
        </CTAContainer>
    );
}

export default CTARegistration;
