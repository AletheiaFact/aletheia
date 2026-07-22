import React from "react";
import { Grid } from "@mui/material";
import AletheiaAvatar from "../AletheiaAvatar";
import PersonalityCardAvatarTooltip from "./PersonalityCardAvatarTooltip";
import { useTranslations } from "next-intl";

const PersonalityCardAvatar = ({
    hoistAvatar,
    personality,
    componentStyle,
}) => {
    const tSeo = useTranslations("seo");

    return (
        <Grid item
            xs={componentStyle.avatarSpan}
            style={{
                alignContent: componentStyle.avatarSize < 90 ? undefined : "center",
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
                        alt={tSeo("personalityImageAlt", {
                            name: personality.name,
                        })}
                    />
                </PersonalityCardAvatarTooltip>
            )}
        </Grid>
    );
};
export default PersonalityCardAvatar;
