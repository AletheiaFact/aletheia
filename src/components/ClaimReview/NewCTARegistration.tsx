import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";

function NewCTARegistration({ style = {} }) {
    const { t } = useTranslation();

    return (
        <div
            style={{
                backgroundColor: colors.graySecondary,
                textAlign: "center",
                padding: "116px 20px 34px 20px",
                ...style
            }}
        >
            <div
                style={{
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "21px",
                    marginBottom: "223px",
                    textAlign: "center"
                }}
            >
                {t("AletheiaFact.org é um movimento e plataforma coletivo de verificação de fatos que imagina uma sociedade onde todos podem ter")}
            </div>
            <Button
                onClick={() => { umami?.trackEvent('cta-registration-button', 'registration') }}
                type={ButtonType.blue}
                target="_blank"
                href={t("common:registrationLink")}
                style={{width:"100%", height: "88px" }}
            >
                <b
                    style={{
                        fontSize: "18px",
                        lineHeight: "80px"
                    }}
                >
                    {t("CTARegistration:button")}
                </b>
            </Button>
        </div>
    );
}

export default NewCTARegistration;
