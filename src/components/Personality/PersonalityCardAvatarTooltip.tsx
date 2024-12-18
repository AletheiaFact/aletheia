import React from "react";
import { Badge, Popover } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { EyeInvisibleFilled, InfoCircleOutlined } from "@ant-design/icons";

const PersonalityCardAvatarTooltip = ({
    children,
    isHidden,
    style,
    offset,
}) => {
    const { t } = useTranslation();

    return (
        <Popover
            placement="rightTop"
            content={
                isHidden
                    ? t("personality:hiddenPersonalityAvatarTooltip")
                    : t("personality:personalityCardWikidataTooltip")
            }
            trigger="hover"
        >
            <Badge
                count={
                    isHidden ? (
                        <EyeInvisibleFilled color={colors.white} />
                    ) : (
                        <InfoCircleOutlined color={colors.white} />
                    )
                }
                style={{
                    borderRadius: "100%",
                    color: colors.primary,
                    background: colors.white,
                    boxShadow: `1px 1px 2px ${colors.secondary}`,
                    ...style,
                }}
                offset={offset}
            >
                {children}
            </Badge>
        </Popover>
    );
};

export default PersonalityCardAvatarTooltip;
