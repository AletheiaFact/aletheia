import React from "react";
import { Avatar, Spin, Col, Row, Typography, Button } from "antd";
import { useTranslation } from "next-i18next";
import { ArrowRightOutlined } from "@ant-design/icons";
import ReviewStats from "../Metrics/ReviewStats";

const { Title, Paragraph } = Typography;

const PersonalityCard = ({
    personality,
    summarized = false,
    enableStats = true,
    header = false,
    hrefBase = '',
    suggestion = 'default',
    onClick = () => {}
}) => {
    const { t } = useTranslation();
    const style = {
        titleSpan: 15,
        avatarSpan: 6,
        avatarSize: 90
    };
    if (summarized) {
        style.titleSpan = 11;
        style.avatarSpan = 2;
        style.avatarSize = 45;
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
        }
    }

    if (personality) {
        return (
            <Row
                style={{
                    width: "100%",
                    ...cardStyle
                }}
            >
                <Row
                    style={{
                        padding: "10px 16px",
                        marginTop: "10px",
                        width: "100%"
                    }}
                >
                    <Col span={style.avatarSpan}>
                        <Avatar
                            size={style.avatarSize}
                            src={personality.image}
                        />
                    </Col>
                    <Col span={3}></Col>
                    <Col span={style.titleSpan}>
                        <Title level={4} style={{ fontSize: "18px", marginBottom: 0 }}>
                            {personality.name}
                        </Title>
                        <Paragraph
                            style={
                                summarized && {
                                    fontSize: "10px"
                                }
                            }
                        >
                            {personality.description}
                        </Paragraph>
                        {summarized && enableStats &&
                        personality.stats?.total !== undefined && (
                            <Paragraph
                                style={{
                                    fontSize: "10px"
                                }}
                            >
                                <b>
                                    {t(
                                        "personality:headerReviewsTotal",
                                        {
                                            totalReviews:
                                            personality.stats?.total
                                        }
                                    )}
                                </b>
                            </Paragraph>
                        )}
                        {!summarized && personality.wikipedia && (
                            <a
                                style={{
                                    fontWeight: "bold"
                                }}
                                target="_blank"
                                href={personality.wikipedia}
                            >
                                {t("personality:wikipediaPage")}{" "}
                                <ArrowRightOutlined />
                            </a>
                        )}
                    </Col>
                    {summarized && (
                        <Col
                            span={8}
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {personality._id ? (
                                <Button
                                    type={
                                        suggestion
                                            ? ""
                                            : "primary"
                                    }
                                    href={`${hrefBase ||
                                    "personality/"}${personality.slug}`}
                                >
                                    {t("personality:profile_button")}
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        onClick(personality)
                                    }
                                >
                                    + {t("personality:add_button")}
                                </Button>
                            )}
                        </Col>
                    )}
                </Row>
                {!summarized && (
                    <hr style={{ opacity: "20%" }} />
                )}
                {enableStats && (
                    <Row style={{ padding: "5px 30px", width: "100%" }}>
                        {!summarized && (
                            <Row
                                style={{
                                    width: "100%",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: "#262626",
                                    padding: "10px 0 25px 0px"
                                }}
                            >
                                {personality?.claims?.length !== undefined && (
                                    <span>
                                            <span
                                                style={{
                                                    color: "#70b0d6",
                                                    fontSize: "20px"
                                                }}
                                            >
                                                {personality.claims.length}
                                            </span>{" "}
                                        {t("personality:headerClaimsTotal")}
                                        </span>
                                )}
                                {personality.stats?.total && (
                                    <span>
                                            <span
                                                style={{
                                                    color: "#70b0d6",
                                                    fontSize: "20px"
                                                }}
                                            >
                                                {t(
                                                    "personality:headerReviewsTotal",
                                                    {
                                                        totalReviews:
                                                        personality.stats?.total
                                                    }
                                                )}
                                            </span>
                                        </span>
                                )}
                            </Row>
                        )}
                        <Row
                            style={{
                                justifyContent: "space-between",
                                width: "100%"
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
                    </Row>
                )}
                <hr style={{ opacity: "20%" }} />
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
                    left: "calc(50% - 40px)"
                }}
            ></Spin>
        );
    }
}

export default PersonalityCard;
