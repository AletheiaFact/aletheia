import React from "react";
import { Col, Divider, Row, Typography } from "antd";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const { Title, Paragraph } = Typography;

interface PersonalityInfo {
    summarized: boolean;
    enableStats: boolean;
    personality: any;
    componentStyle: any; //adicionar tipo do componente style
    titleLevel: 1 | 2 | 3 | 4 | 5;
}

export const PersonalityInfo = (props: PersonalityInfo) => {
    const { t } = useTranslation();
    const { componentStyle, summarized, personality, titleLevel, enableStats } =
        props;
    return (
        <Col
            span={componentStyle.titleSpan}
            className="personality-card-content"
            style={{
                width: "50%",
                flex: "auto",
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
                            {t("personality:headerReviewsTotal", {
                                totalReviews: personality.stats?.total,
                            })}
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
            {!summarized && <Divider style={{ margin: "16px 0" }} />}
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
                            {personality?.claims?.length !== undefined && (
                                <span>
                                    {t("personality:headerClaimsTotal", {
                                        totalClaims: personality.claims.length,
                                    })}
                                </span>
                            )}
                            {personality.stats?.total !== undefined && (
                                <span>
                                    {t("personality:headerReviewsTotal", {
                                        totalReviews: personality.stats?.total,
                                    })}
                                </span>
                            )}
                        </Row>
                    )}
                </Row>
            )}
        </Col>
    );
};
