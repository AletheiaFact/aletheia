import { useTranslation } from "next-i18next";
import React from "react";
import { Typography } from "antd";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import styled from "styled-components";

const CTAContainer = styled.div`
    background-color: ${colors.bluePrimary};
    text-align: center;
    padding: 32px 0;
    border-radius: 4px;
    margin-bottom: 45px;

    @media (max-width: 1024px) {
        padding: 32px;
    }

    @media (max-width: 548px) {
        margin-bottom: 22px;
        border-radius: 0;
    }
        
`

function CTARegistration({ style = {} }) {
    const { t } = useTranslation();

    return (
        <CTAContainer
            style={{
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
                    textAlign: 'center',
                    padding: "0 16px 0 16px",
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
                    padding: "0 16px 0 16px",
                }}
            >
                {t("CTARegistration:footer")}
            </p>
            <Button
                onClick={() => { umami?.trackEvent('cta-registration-button', 'registration') }}
                type={ButtonType.white}
                target="_blank"
                href={t("common:registrationLink")}
                className="cta-registration-button"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 16px",
                    height: "40px",
                    padding: "0 15px",
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
        </CTAContainer>
    );
}

export default CTARegistration;
