import React from "react";
import { EyeInvisibleFilled } from "@ant-design/icons";
import { Badge, Col, Popover } from "antd";
import colors from "../../styles/colors";
import AletheiaAvatar from "../AletheiaAvatar";
import { useTranslation } from "next-i18next";
const PersonalityCardAvatar = ({
    hoistAvatar,
    personality,
    componentStyle,
    header,
}) => {
    const { t } = useTranslation();
    return (
        <Col
            span={componentStyle.avatarSpan}
            style={{
                padding: 0,
                minWidth:
                    componentStyle.avatarSize < 100
                        ? componentStyle.avatarSize + 0.02 * 6
                        : componentStyle.avatarSize + 12,
            }}
        >
            {!hoistAvatar && personality.isHidden && (
                <Popover
                    placement="topRight"
                    content={t("personality:hiddenPersonalityAvatarTooltip")}
                    trigger="hover"
                >
                    <Badge
                        count={<EyeInvisibleFilled color="#fff" />}
                        color="#faad14"
                        style={{
                            borderRadius: "100%",
                            color: colors.bluePrimary,
                            padding: header ? 8 : 4,
                            background: colors.white,
                            fontSize: header ? 18 : 12,
                            boxShadow: `1px 1px 2px ${colors.blueSecondary}`,
                        }}
                        offset={header ? [-24, 24] : [-4, 4]}
                    >
                        <AletheiaAvatar
                            size={componentStyle.avatarSize}
                            src={personality.avatar}
                            alt={t("seo:personalityImageAlt", {
                                name: personality.name,
                            })}
                        />
                    </Badge>
                </Popover>
            )}
            {!hoistAvatar && !personality.isHidden && (
                <AletheiaAvatar
                    size={componentStyle.avatarSize}
                    src={personality.avatar}
                    alt={t("seo:personalityImageAlt", {
                        name: personality.name,
                    })}
                />
            )}
        </Col>
    );
};
export default PersonalityCardAvatar;
