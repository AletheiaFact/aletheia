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
                padding: "32px 16px",
                borderRadius: "4px",
                marginBottom: "32px",
                ...style
            }}
        >
            <Typography.Title
                level={2}
                style={{
                    color: "#fff",
                    fontSize: '22px',
                    lineHeight: "34px",
                    fontWeight: 800,
                    marginBottom: 0,
                }}
            >
                {t("CTARegistration:title")}
            </Typography.Title>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "24px",
                    margin: "32px 0 13px 0",
                    textAlign: 'center'
                }}
            >
                {t("CTARegistration:body")}
            </p>
            <p
                style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "22px",
                    marginBottom: "32px",
                }}
            >
                {t("CTARegistration:footer")}
            </p>
            <Button
                onClick={() => { umami?.trackEvent('cta-registration-button', 'registration') }}
                type={ButtonType.white}
                target="_blank"
                href={t("common:registrationLink")}
                style={{
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
