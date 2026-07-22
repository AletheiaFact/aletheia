import { Grid, Typography } from "@mui/material";
import React from "react";
import PersonalityMinimalCardStyle from "./PersonalityMinimalCard.style";
import PersonalityCardAvatar from "./PersonalityCardAvatar";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import { useTranslations } from "next-intl";
import { Personality } from "../../types/Personality";

interface PersonalityMinimalCardProps {
    personality: Personality;
    avatarSize?: number;
    isInline?: boolean;
}

const PersonalityMinimalCard = ({
    personality,
    avatarSize = 117,
    isInline = false,
}: PersonalityMinimalCardProps) => {
    const tPersonality = useTranslations("personality");
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <PersonalityMinimalCardStyle
            container
            className="personality-card"
            $isInline={isInline}
        >
            <Grid item>
                <PersonalityCardAvatar
                    hoistAvatar={false}
                    personality={personality}
                    componentStyle={{
                        avatarSize: avatarSize,
                        avatarSpan: 4,
                        hiddenIconSize: 16,
                    }}
                />
            </Grid>
            <Grid item className="personality-info">
                <Typography variant="h2" className="personality-name">
                    {personality.name}
                </Typography>
                <p className="personality-description-content">
                    <span className="personality-description">
                        {personality.description}
                    </span>
                    <a
                        className="personality-profile"
                        href={
                            nameSpace !== NameSpaceEnum.Main
                                ? `/${nameSpace}/personality/${personality.slug}`
                                : `/personality/${personality.slug}`
                        }
                    >
                        {tPersonality("profile_button")}
                    </a>
                </p>
            </Grid>
        </PersonalityMinimalCardStyle>
    );
};

export default PersonalityMinimalCard;
