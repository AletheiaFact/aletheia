import React from "react";
import { VisibilityOff, InfoOutlined } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import InfoTooltip from "../Claim/InfoTooltip";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";

const PersonalityCardAvatarTooltip = ({
    children,
    isHidden,
    style,
}) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);

    const InfoBadge = (
        <Badge
            overlap="circular"
            badgeContent={
                <IconButton
                    disabled
                    style={{
                        color: colors.primary,
                        backgroundColor: colors.white,
                        boxShadow: `0px 3px 3px ${colors.shadow}`,
                        padding: 5
                    }}
                >
                    {
                        isHidden ? (
                            <VisibilityOff sx={{ ...style }} />
                        ) : (
                            <InfoOutlined sx={{ ...style }} />
                        )
                    }
                </IconButton>
            }
        >
            {children}
        </Badge>
    );

    return (
        <InfoTooltip
            placement={vw?.xs ? "bottom":"right-start"}
            children={InfoBadge}
            content={
                <p
                    style={{
                        color: colors.primary,
                        lineHeight: "20px",
                        fontSize: 14,
                        padding: 10,
                        margin: 0
                    }}
                >
                    {isHidden
                        ? t("personality:hiddenPersonalityAvatarTooltip")
                        : t("personality:personalityCardWikidataTooltip")
                    }
                </p>
            }
        />
    );
};

export default PersonalityCardAvatarTooltip;
