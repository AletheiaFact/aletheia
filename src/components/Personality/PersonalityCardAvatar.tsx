import React from "react";
import { Col } from "antd";
import AletheiaAvatar from "../AletheiaAvatar";
import { useTranslation } from "next-i18next";

const PersonalityCardAvatar = ({
    hoistAvatar,
    personality,
    componentStyle,
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
                <AletheiaAvatar
                    size={componentStyle.avatarSize}
                    src={personality.avatar}
                    alt={t("seo:personalityImageAlt", {
                        name: personality.name,
                    })}
                />
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
