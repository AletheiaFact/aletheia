import React from "react";
import { Col } from "antd";
import AletheiaAvatar from "../AletheiaAvatar";
import { useTranslation } from "next-i18next";
import PersonalityCardTooltip from "./PersonalityCardTooltip";

const PersonalityCardAvatar = ({
    hoistAvatar,
    personality,
    componentStyle,
    header,
    offset = null,
}) => {
    const { t } = useTranslation();
    const tooltipOffset = offset || (header ? [-24, 24] : [-4, 4]);

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
            <PersonalityCardTooltip
                isHidden={personality?.isHidden}
                offset={tooltipOffset}
                style={{
                    padding: componentStyle.hiddenIconSize / 2.5,
                    fontSize: componentStyle.hiddenIconSize,
                }}
            >
                <AletheiaAvatar
                    size={componentStyle.avatarSize}
                    src={personality.avatar}
                    alt={t("seo:personalityImageAlt", {
                        name: personality.name,
                    })}
                />
            </PersonalityCardTooltip>
        </Col>
    );
};
export default PersonalityCardAvatar;
