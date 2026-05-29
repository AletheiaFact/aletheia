import React from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { trackUmamiEvent } from "../../lib/umami";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";
import { FavoriteBorderOutlined } from "@mui/icons-material";

const DonateButton = ({ header = false, style = {} }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);

    return (
        <AletheiaButton
            type={ButtonType.white}
            href={t("home:donateUrlButton")}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                trackUmamiEvent("header-cta-donate-button", "Donate");
            }}
            icon={<FavoriteBorderOutlined fontSize="inherit" />}
            style={{
                fontWeight: 600,
                height: header ? 32 : 40,
                lineHeight: "16px",
                textAlign: "center",
                justifyContent: "center",
                fontSize: vw?.xs ? "10px" : "12px",
                padding: header ? "6px 4px" : "6px 16px",
                ...style,
            }}
        >
            {t("home:donateButton")}
        </AletheiaButton>
    );
};

export default DonateButton;
