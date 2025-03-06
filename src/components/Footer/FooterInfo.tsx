import { DescriptionOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material"
import { useTranslation } from "next-i18next";
import React from "react";
import { useAppSelector } from "../../store/store";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";
import localConfig from "../../../config/localConfig";

const FooterInfo = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const href = " https://github.com/AletheiaFact/aletheia";

    return (
        <Grid container style={{ justifyContent: vw?.sm ? "center" : "start" }}>
            <span style={{ textAlign: "justify", marginBottom: "16px" }}>
                {t("about:alertInfo")}
                <a
                    style={{
                        whiteSpace: "pre-wrap",
                        display: "inline",
                        color: colors.white,
                    }}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                >
                    {href}
                </a>
            </span>
            {localConfig.footer.showStatuteButton.show ? (
                <AletheiaButton
                    style={{gap:"5px"}}
                    type={ButtonType.whiteBlue}
                    href={t("footer:statuteUrlButton")}
                    target="_blank"
                    rel="noreferrer"
                >
                        {t("about:labelButton")} <DescriptionOutlined fontSize="small"/>
                </AletheiaButton>
            ) : null}
        </Grid>
    );
};

export default FooterInfo;
