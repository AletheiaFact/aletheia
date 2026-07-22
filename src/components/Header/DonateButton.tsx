import React from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { trackUmamiEvent } from "../../lib/umami";
import { useAppSelector } from "../../store/store";
import { Favorite } from "@mui/icons-material";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

const DonateButton = ({ header = false, style = {} }) => {
    const tHome = useTranslations("home");
    const { vw } = useAppSelector((state) => state);

    return (
        <AletheiaButton
            type={ButtonType.white}
            href={tHome("donateUrlButton")}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                trackUmamiEvent("header-cta-donate-button", "Donate");
            }}
            startIcon={<Favorite style={{ fontSize: "12px", color: colors.error }} />}
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
            {tHome("donateButton")}
        </AletheiaButton>
    );
};

export default DonateButton;
