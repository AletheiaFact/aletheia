import React from "react";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import LocalizedDate from "../LocalizedDate";
import colors from "../../styles/colors";

const ClaimInfo = ({
    isImage,
    date,
    speechTypeTranslation = "claim:typeSpeech",
    style = {},
}) => {
    const { t } = useTranslation();
    const textstyle = {
        marginTop: 20,
        color: colors.blackSecondary,
        fontSize: 10,
        lineHeight: "16px",
        ...style
    }

    return (
        <>
            {!isImage ? (
                <Typography
                    variant="body1"
                    style={textstyle}
                >
                    {t("claim:cardHeader1")}&nbsp;
                    <LocalizedDate date={date || new Date()} />
                    &nbsp;
                    {t("claim:cardHeader2")}&nbsp;
                    <strong>{t(speechTypeTranslation)}</strong>
                </Typography>
            ) : (
                <Typography
                    variant="body1"
                    style={textstyle}
                    >
                    {t("claim:cardHeader3")}&nbsp;
                    <LocalizedDate date={date || new Date()} />
                </Typography>
            )}
        </>
    );
};

export default ClaimInfo;
