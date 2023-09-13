import { Badge, Popover } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import { EyeInvisibleFilled } from "@ant-design/icons";

const HiddenPersonalityAvatarTooltip = ({ children, offset, style }) => {
    const { t } = useTranslation();

    return (
        <Popover
            placement="topRight"
            content={t("personality:hiddenPersonalityAvatarTooltip")}
            trigger="hover"
        >
            <Badge
                count={<EyeInvisibleFilled color={colors.white} />}
                style={{
                    borderRadius: "100%",
                    color: colors.bluePrimary,
                    background: colors.white,
                    boxShadow: `1px 1px 2px ${colors.blueSecondary}`,
                    ...style,
                }}
                offset={offset}
            >
                {children}
            </Badge>
        </Popover>
    );
};

export default HiddenPersonalityAvatarTooltip;
