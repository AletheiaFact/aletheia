import { useTranslation } from "next-i18next";
import React from "react";
import { Typography } from "antd";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";

function CTARegistration({ style = {} }) {
    const { t } = useTranslation();

    return (
        <div
            style={{
                backgroundColor: colors.bluePrimary,
                textAlign: "center",
                padding: "30px",
                ...style
            }}
        >
            <Typography.Title level={2} style={{ color: "#fff", fontSize: '24px' }}>
                {t("CTARegistration:title")}
            </Typography.Title>
            <div
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    marginBottom: "10px",
                    textAlign: 'center'
                }}
            >
                {t("CTARegistration:body")}
            </div>
            <div
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "22px",
                    marginBottom: "17px",
                }}
            >
                {t("CTARegistration:footer")}
            </div>
            <Button
                onClick={() => { umami?.trackEvent('cta-registration-button', 'registration') }}
                type={ButtonType.white}
                target="_blank"
                href={t("common:registrationLink")}
                style={{
                    width: "120px",
                    height: "40px",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                }}
            >
                <b
                    style={{
                        fontSize: "14px"
                    }}
                >
                    {t("CTARegistration:button")}
                </b>
            </Button>
        </div>
    );
}

export default CTARegistration;
