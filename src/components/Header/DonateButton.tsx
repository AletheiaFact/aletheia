import React from "react";
import AletheiaButton, { ButtonType } from "../Button";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslation } from "next-i18next";
import localConfig from "../../../config/localConfig";

const DonateButton = ({ header = false, style = {} }) => {
    const { t } = useTranslation();
    return (
        <AletheiaButton
            type={ButtonType.white}
            href={localConfig.header.donateButton.redirectUrl ? localConfig.header.donateButton.redirectUrl : "https://donate.aletheiafact.org/"}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                trackUmamiEvent("header-cta-donate-button", "Donate");
            }}
            style={{
                fontWeight: 600,
                height: header ? 32 : 40,
                ...style,
            }}
        >
            {localConfig.header.donateButton.text ? localConfig.header.donateButton.text : t("home:donateButton")}
        </AletheiaButton>
    );
};

export default DonateButton;
