import React from "react";
import AletheiaButton, { ButtonType } from "../Button";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslation } from "next-i18next";

const DonateButton = () => {
    const { t } = useTranslation();
    return (
        <AletheiaButton
            type={ButtonType.whiteBlue}
            href="https://donate.aletheiafact.org/"
            target="_blank"
            rel="noreferrer"
            style={{ minWidth: "75px" }}
            rounded="true"
            onClick={() => {
                trackUmamiEvent("header-cta-donate-button", "Donate");
            }}
        >
            {t("header:donate_button")}
        </AletheiaButton>
    );
};

export default DonateButton;
