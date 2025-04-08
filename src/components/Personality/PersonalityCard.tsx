import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";

import AletheiaAvatar from "../AletheiaAvatar";
import ReviewStats from "../Metrics/ReviewStats";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import { useAppSelector } from "../../store/store";
import { useAtom } from "jotai";
import { createClaimMachineAtom } from "../../machines/createClaim/provider";
import PersonalityCardAvatar from "./PersonalityCardAvatar";
import PersonalityCardButton from "./PersonalityCardButton";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import { PersonalityInfo } from "./PersonalityInfo";
import colors from "../../styles/colors";

interface PersonalityCardProps {
    personality: any;
    isCreatingClaim?: boolean;
    summarized?: boolean;
    enableStats?: boolean;
    header?: boolean;
    hrefBase?: string;
    mobile?: boolean;
    fullWidth?: boolean;
    hoistAvatar?: boolean;
    style?: CSSProperties;
    selectPersonality?: any;
    isFormSubmitted?: boolean;
    onClick?: any;
    titleLevel?: "h1" | "h2" | "h3" | "h4" | "h5";
    centralizedInfo?: boolean;
}

const PersonalityCard = ({
    personality,
    summarized = false,
    enableStats = true,
    header = false,
    hrefBase = "",
    mobile = false,
    fullWidth = false,
    hoistAvatar = false,
    style,
    onClick,
    titleLevel = "h1",
    selectPersonality = null,
    isFormSubmitted,
    centralizedInfo = false,
}: PersonalityCardProps) => {
    const isCreatingClaim = selectPersonality !== null;
    const [state] = useAtom(createClaimMachineAtom);
    const { claimData } = state.context;
    const { personalities } = claimData;
    const [nameSpace] = useAtom(currentNameSpace);
    const { vw } = useAppSelector((state) => state);
    const smallDevice = vw?.sm;

    const baseHref = hrefBase || "";
    const nameSpaceHref =
        nameSpace !== NameSpaceEnum.Main
            ? `/${nameSpace}/personality/`
            : "/personality/";

    const personalityFoundProps = isCreatingClaim
        ? {
            onClick: () => {
                if (selectPersonality) {
                    selectPersonality(personality);
                }
            },
        }
        : {
            href: `${baseHref || nameSpaceHref}${personality.slug}`,
            onClick,
        };

    const personalityIsSelected = personalities.some(
        (item) => item._id === personality._id
    );
    const hasReview = personality?.stats?.reviews?.length > 0;
    const { t } = useTranslation();
    const componentStyle = {
        titleSpan: !fullWidth ? 7 : 12,
        avatarSpan: !fullWidth ? 4 : 12,
        buttonSpan: !fullWidth ? 2.5 : 12,
        avatarSize: 90,
        hiddenIconSize: 12,
    };
    if (summarized) {
        componentStyle.titleSpan = 5;
        componentStyle.avatarSpan = 2.5;
        componentStyle.buttonSpan = 4.5;
        componentStyle.avatarSize = 43;
    }
    if (header) {
        componentStyle.avatarSize = 144;
        componentStyle.hiddenIconSize = 22;
    }

    let cardStyle;
    if (!header) {
        cardStyle = {
            background: colors.white,
            border: `1px solid ${colors.lightNeutralSecondary}`,
            boxSizing: "border-box",
            boxShadow: `0px 3px 3px ${colors.shadow}`,
            borderRadius: "10px",
            marginBottom: "10px",
        };
    }

    if (personality) {
        return (
            <Grid container
                style={{
                    width: "100%",
                    ...cardStyle,
                    ...style,
                }}
            >
                {hoistAvatar && (
                    <AletheiaAvatar
                        size={componentStyle.avatarSize}
                        src={personality.avatar}
                        alt={t("seo:personalityImageAlt", {
                            name: personality.name,
                        })}
                    />
                )}
                <Grid item
                    md={12}
                    lg={header && !mobile && !fullWidth ? 6 : 12}
                    style={{
                        width: "100%",
                        textAlign: hoistAvatar ? "center" : "inherit",
                    }}
                >
                    <Grid container
                        columnSpacing={summarized ? 0 : 1.5}
                        style={{
                            alignContent: summarized ? "center": undefined,
                            width: "100%",
                            padding: "12px",
                        }}
                    >
                        <PersonalityCardAvatar
                            hoistAvatar={hoistAvatar}
                            personality={personality}
                            componentStyle={componentStyle}
                        />

                        {((hoistAvatar && (!vw?.sm || !vw?.xs)) ||
                            !hoistAvatar) && (

                                <PersonalityInfo
                                    personality={personality}
                                    componentStyle={componentStyle}
                                    enableStats={enableStats}
                                    summarized={summarized}
                                    titleLevel={titleLevel}
                                    centralized={centralizedInfo}
                                />
                            )}

                        {summarized && (
                            <Grid item
                                xs={componentStyle.buttonSpan}
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    maxHeight: 40,
                                }}
                            >
                                <PersonalityCardButton
                                    personality={personality}
                                    personalityFoundProps={
                                        personalityFoundProps
                                    }
                                    isFormSubmitted={isFormSubmitted}
                                    personalityIsSelected={
                                        personalityIsSelected
                                    }
                                    isCreatingClaim={isCreatingClaim}
                                    onClick={onClick}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {!smallDevice && enableStats && hasReview && (
                    <Grid item
                        xs={12}
                        lg={header && !mobile ? 6 : 12}
                        style={{
                            padding: "5px 15px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Grid container
                            style={{
                                width: "100%",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <ReviewStats
                                stats={personality.stats}
                                type="circle"
                                size={summarized ? 30 : 80}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
        );
    } else {
        return <PersonalitySkeleton />;
    }
};

export default PersonalityCard;
