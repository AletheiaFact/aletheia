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
    max-width: 100%;
    display: grid;
    justify-content: center;

    .cta-title {
        width: 100%;
        color: ${colors.white};
        font-size: 22px;
        line-height: 34px;
        font-weight: 800;
        margin-bottom: 0;
    }

    .cta-body-paragraph,
    .cta-footer-paragraph {
        color: rgba(255, 255, 255, 0.8);
        padding: 0 16px 0 16px;
    }

    .cta-body-paragraph {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin: 32px 0 13px 0;
    }

    .cta-footer-paragraph {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 32px;
    }

    .cta-registration-button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 16px;
        height: 40px;
        padding: 0 15px;
        font-weight: 700;
    }

    @media (max-width: 1024px) {
        padding: 32px;

        .cta-registration-button {
            margin: 0 auto;
            display: flex;
        }
    }

    @media (max-width: 548px) {
        margin-bottom: 22px;
        border-radius: 0;
    }
        
`

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
