import { Col, Divider, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React, { CSSProperties } from "react";

import colors from "../../styles/colors";
import AletheiaAvatar from "../AletheiaAvatar";
import ReviewStats from "../Metrics/ReviewStats";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import { useAppSelector } from "../../store/store";
import { useAtom } from "jotai";
import { createClaimMachineAtom } from "../../machines/createClaim/provider";
import PersonalityCardAvatar from "./PersonalityCardAvatar";
import PersonalityCardButton from "./PersonalityCardButton";

const { Title, Paragraph } = Typography;

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
    const { vw } = useAppSelector((state) => state);
    const personalityFoundProps = isCreatingClaim
        ? {
              onClick: () => {
                  if (selectPersonality) {
                      selectPersonality(personality);
                  }
              },
          }
        : {
              href: `${hrefBase || "/personality/"}${personality.slug}`,
              onClick,
          };

    const personalityIsSelected = personalities.some(
        (item) => item._id === personality._id
    );

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
                            <Col
                                span={componentStyle.titleSpan}
                                className="personality-card-content"
                                style={{
                                    width: "100%",
                                }}
                            >
                                {summarized && (
                                    <Paragraph
                                        style={{
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                            fontWeight: 600,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {personality.name}
                                    </Paragraph>
                                )}
                                {!summarized && (
                                    <Title
                                        level={titleLevel}
                                        style={{
                                            fontSize: "24px",
                                            lineHeight: "32px",
                                            fontWeight: 400,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {personality.name}
                                    </Title>
                                )}
                                <Paragraph
                                    style={{
                                        fontSize: summarized ? "10px" : "14px",
                                        color: colors.blackSecondary,
                                        marginBottom: 4,
                                    }}
                                >
                                    {personality.description}
                                </Paragraph>
                                {summarized &&
                                    enableStats &&
                                    personality.stats?.total !== undefined && (
                                        <Paragraph
                                            style={{
                                                fontSize: "10px",
                                                fontWeight: 600,
                                                lineHeight: "15px",
                                                color: colors.blackSecondary,
                                            }}
                                        >
                                            <b>
                                                {t(
                                                    "personality:headerReviewsTotal",
                                                    {
                                                        totalReviews:
                                                            personality.stats
                                                                ?.total,
                                                    }
                                                )}
                                            </b>
                                        </Paragraph>
                                    )}
                                {!summarized && personality.wikipedia && (
                                    <a
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "12px",
                                            lineHeight: "16px",
                                            color: colors.bluePrimary,
                                            textDecoration: "underline",
                                        }}
                                        target="_blank"
                                        href={personality.wikipedia}
                                        rel="noreferrer"
                                    >
                                        {t("personality:wikipediaPage")}
                                    </a>
                                )}
                                {!summarized && (
                                    <Divider style={{ margin: "16px 0" }} />
                                )}
                                {enableStats && (
                                    <Row>
                                        {!summarized && (
                                            <Row
                                                style={{
                                                    flexDirection: "column",
                                                    color: colors.blackPrimary,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {personality?.claims?.length !==
                                                    undefined && (
                                                    <span>
                                                        {t(
                                                            "personality:headerClaimsTotal",
                                                            {
                                                                totalClaims:
                                                                    personality
                                                                        .claims
                                                                        .length,
                                                            }
                                                        )}
                                                    </span>
                                                )}
                                                {personality.stats?.total !==
                                                    undefined && (
                                                    <span>
                                                        {t(
                                                            "personality:headerReviewsTotal",
                                                            {
                                                                totalReviews:
                                                                    personality
                                                                        .stats
                                                                        ?.total,
                                                            }
                                                        )}
                                                    </span>
                                                )}
                                            </Row>
                                        )}
                                    </Row>
                                )}
                            </Col>
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
                {enableStats && (
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
