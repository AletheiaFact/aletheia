import React from "react";
import AletheiaButton, { ButtonType } from "../Button";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslation } from "next-i18next";

const DonateButton = ({ header = false, style = {} }) => {
    const { t } = useTranslation();
    return (
        <AletheiaButton
            type={ButtonType.white}
            href={t("home:donateUrlButton")}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                trackUmamiEvent("header-cta-donate-button", "Donate");
            }}
            style={{
                fontWeight: 600,
                height: header ? 32 : 40,
                lineHeight: "16px",
                textAlign: "center",
                justifyContent: "center",
                ...style,
            }}
        >
            {t("home:donateButton")}
        </AletheiaButton>
    );
};

export default DonateButton;
