import React from "react";
import { Grid } from "@mui/material";
import AletheiaAvatar from "../AletheiaAvatar";
import { useTranslation } from "next-i18next";
import PersonalityCardAvatarTooltip from "./PersonalityCardAvatarTooltip";

const PersonalityCardAvatar = ({
    hoistAvatar,
    personality,
    componentStyle,
}) => {
    const { t } = useTranslation();

    return (
        <Grid item
            xs={componentStyle.avatarSpan}
            style={{
                alignContent: componentStyle.avatarSize < 90 ? undefined : "center",
                padding: 0,
                minWidth:
                    componentStyle.avatarSize < 100
                        ? componentStyle.avatarSize + 0.02 * 6
                        : componentStyle.avatarSize + 12,
            }}
        >
            {!hoistAvatar && (
                <PersonalityCardAvatarTooltip
                    isHidden={personality?.isHidden}
                    style={{
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
                </PersonalityCardAvatarTooltip>
            )}
        </Grid>
    );
};
export default PersonalityCardAvatar;
