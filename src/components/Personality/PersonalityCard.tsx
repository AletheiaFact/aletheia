import React, { useState } from "react";
import { Avatar, Spin, Col, Row, Typography, Divider } from "antd";
import { useTranslation } from "next-i18next";
import { PlusOutlined } from "@ant-design/icons";
import ReviewStats from "../Metrics/ReviewStats";
import Button, { ButtonType } from "../Button";
import colors from "../../styles/colors";
const { Title, Paragraph } = Typography;

const PersonalityCard = ({
    personality,
    summarized = false,
    enableStats = true,
    header = false,
    hrefBase = "",
    mobile = false,
    onClick,
}: {
    personality: any;
    summarized?: boolean;
    enableStats?: boolean;
    header?: boolean;
    hrefBase?: string;
    mobile?: boolean;
    onClick?: (personality: any) => {};
}) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const { t } = useTranslation();
    const style = {
        titleSpan: 14,
        avatarSpan: 8,
        buttonSpan: 5,
        avatarSize: 90,
    };
    if (summarized) {
        style.titleSpan = 10;
        style.avatarSpan = 5;
        style.buttonSpan = 9;
        style.avatarSize = 43;
    }
    if (header) {
        style.avatarSize = 144;
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
                }}
            >
                {" "}
                <Col
                    md={24}
                    lg={header && !mobile ? 12 : 24}
                    style={{ width: "100%" }}
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
                        <Col
                            span={style.avatarSpan}
                            style={{
                                minWidth: style.avatarSize,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Avatar
                                size={style.avatarSize}
                                style={{
                                    aspectRatio: "auto",
                                    outlineColor: colors.blueQuartiary,
                                    outlineStyle: "solid",
                                    outlineWidth: summarized ? "1.5px" : "2px",
                                    outlineOffset: summarized ? "2px" : "5px",
                                }}
                                src={personality.avatar}
                                alt={t("seo:personalityImageAlt", {
                                    name: personality.name,
                                })}
                            />
                        </Col>
                        <Col
                            span={style.titleSpan}
                            className="personality-card-content"
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
                                    level={1}
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
                        {summarized && (
                            <Col
                                span={style.buttonSpan}
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                {personality._id ? (
                                    <Button
                                        type={ButtonType.blue}
                                        data-cy={personality.name}
                                        href={`${hrefBase || "/personality/"}${
                                            personality.slug
                                        }`}
                                        style={{
                                            fontSize: "12px",
                                            lineHeight: "20px",
                                            height: "auto",
                                            padding: "4px 12px",
                                        }}
                                    >
                                        <span style={{ marginTop: 4 }}>
                                            {t("personality:profile_button")}
                                        </span>
                                    </Button>
                                ) : (
                                    <Button
                                        type={ButtonType.blue}
                                        onClick={() => {
                                            if (!isFormSubmitted) {
                                                setIsFormSubmitted(true);
                                                onClick(personality);
                                            }
                                        }}
                                        disabled={isFormSubmitted}
                                        data-cy={personality.name}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 40,
                                            paddingBottom: 0,
                                        }}
                                    >
                                        <PlusOutlined />{" "}
                                        {t("personality:add_button")}
                                    </Button>
                                )}
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
        return (
            <Spin
                tip={t("common:loading")}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "calc(50% - 40px)",
                }}
            ></Spin>
        );
    }
};

export default PersonalityCard;
