import { Col, Row } from "antd";
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
    titleLevel?: 1 | 2 | 3 | 4 | 5;
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
    titleLevel = 1,
    selectPersonality = null,
    isFormSubmitted,
}: PersonalityCardProps) => {
    const isCreatingClaim = selectPersonality !== null;
    const [state] = useAtom(createClaimMachineAtom);
    const { claimData } = state.context;
    const { personalities } = claimData;
    const [nameSpace] = useAtom(currentNameSpace);
    const { vw } = useAppSelector((state) => state);

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
        titleSpan: !fullWidth ? 14 : 24,
        avatarSpan: !fullWidth ? 8 : 24,
        buttonSpan: !fullWidth ? 5 : 24,
        avatarSize: 90,
        hiddenIconSize: 12,
    };
    if (summarized) {
        componentStyle.titleSpan = 10;
        componentStyle.avatarSpan = 5;
        componentStyle.buttonSpan = 9;
        componentStyle.avatarSize = 43;
    }
    if (header) {
        componentStyle.avatarSize = 144;
        componentStyle.hiddenIconSize = 18;
    }

    let cardStyle;
    if (!header) {
        cardStyle = {
            background: "#FFFFFF",
            border: "1px solid #EEEEEE",
            boxSizing: "border-box",
            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            marginBottom: "10px",
        };
    }

    if (personality) {
        return (
            <Row
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
                <Col
                    md={24}
                    lg={header && !mobile && !fullWidth ? 12 : 24}
                    style={{
                        width: "100%",
                        textAlign: hoistAvatar ? "center" : "inherit",
                    }}
                >
                    <Row
                        gutter={summarized ? 0 : 20}
                        align={header ? "middle" : "top"}
                        style={{
                            width: "100%",
                            padding: "15px",
                            paddingBottom: 0,
                        }}
                    >
                        <PersonalityCardAvatar
                            hoistAvatar={hoistAvatar}
                            personality={personality}
                            componentStyle={componentStyle}
                            header={header}
                        />

                        {((hoistAvatar && (!vw?.sm || !vw?.xs)) ||
                            !hoistAvatar) && (
                            <PersonalityInfo
                                personality={personality}
                                componentStyle={componentStyle}
                                enableStats={enableStats}
                                summarized={summarized}
                                titleLevel={titleLevel}
                            />
                        )}
                        {summarized && (
                            <Col
                                span={componentStyle.buttonSpan}
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
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
                            </Col>
                        )}
                    </Row>
                </Col>
                {enableStats && hasReview && (
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={header && !mobile ? 12 : 24}
                        style={{
                            padding: "5px 15px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Row
                            style={{
                                width: "100%",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <ReviewStats
                                stats={personality.stats}
                                type="circle"
                                format="count"
                                width={summarized && 30}
                                showInfo={!summarized}
                                strokeWidth="16"
                            />
                        </Row>
                    </Col>
                )}
            </Row>
        );
    } else {
        return <PersonalitySkeleton />;
    }
};

export default PersonalityCard;
