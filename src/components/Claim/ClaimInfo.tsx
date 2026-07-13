import React from "react";
import Typography from "@mui/material/Typography";
import LocalizedDate from "../LocalizedDate";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

const ClaimInfo = ({
    isImage,
    date,
    speechTypeTranslation = "claim:typeSpeech",
    style = {},
}) => {
    const tClaim = useTranslations("claim");
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
                    {tClaim("cardHeader1")}&nbsp;
                    <LocalizedDate date={date || new Date()} />
                    &nbsp;
                    {tClaim("cardHeader2")}&nbsp;
                    <strong>{tClaim(speechTypeTranslation)}</strong>
                </Typography>
            ) : (
                <Typography
                    variant="body1"
                    style={textstyle}
                >
                    {tClaim("cardHeader3")}&nbsp;
                    <LocalizedDate date={date || new Date()} />
                </Typography>
            )}
        </>
    );
};

export default ClaimInfo;
