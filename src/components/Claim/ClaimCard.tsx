import { Avatar, Col, Comment, Row, Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import ReviewColors from "../../constants/reviewColors";
import CardBase from "../CardBase";
import ClaimSummary from "./ClaimSummary";
import Button, { ButtonType } from "../Button";
import ClaimCardHeader from "./ClaimCardHeader";
import colors from "../../styles/colors";

const { Paragraph, Title } = Typography;

const ClaimCard = ({ personality, claim }) => {
    const { t } = useTranslation();
    const review = claim?.stats?.reviews[0];

    if (!claim) {
        return <div></div>;
    }
    return (
        <CardBase>
            <Row style={{ width: '100%' }}>
                <Comment
                    style={{
                        padding: "15px 15px 0px 15px",
                        width: '100%'
                    }}
                    author={
                        <ClaimCardHeader
                            personality={personality}
                            date={claim?.date}
                            claimType={claim?.type}
                        />
                    }
                    avatar={
                        <Avatar
                            src={personality.image}
                            alt={personality.name}
                        />
                    }
                    content={
                        <ClaimSummary
                            style={{
                                padding: "15px",
                                width: "100%"
                            }}
                        >
                            <Col>
                                <Paragraph
                                    ellipsis={{
                                        rows: 4,
                                        expandable: false
                                    }}
                                >
                                    <cite style={{ fontStyle: "normal" }}>
                                        <p
                                            style={{
                                                fontSize: 14,
                                                color: colors.blackPrimary,
                                                fontWeight: 400,
                                                margin: 0,
                                                lineHeight: 1.6,
                                                height: '6.4em'
                                            }}>
                                            {claim?.content?.text || claim?.title}
                                        </p>
                                    </cite>
                                </Paragraph>
                                <a
                                    href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                    style={{
                                        color: colors.bluePrimary,
                                        fontWeight: 'bold',
                                        textDecoration: "underline"
                                    }}
                                    data-cy={"testSeeFullSpeech"}
                                >
                                    {t("claim:cardLinkToFullText")}
                                </a>
                            </Col>
                        </ClaimSummary>

                    }
                />
            </Row>
            <Row
                style={{
                    padding: "0px 15px 15px 15px",
                    width: "100%"
                }}
                justify="space-between"
            >
                <Col
                    span={16}
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    <p
                        style={{
                            width: '100%',
                            fontSize: "14px",
                            margin: 0,
                        }}
                    >
                        {t("claim:metricsHeaderInfo", {
                            totalReviews: claim
                                ?.stats?.total
                        })}
                    </p>{" "}
                    <Paragraph
                        style={{
                            fontSize: "10px",
                            marginTop: 5,
                            marginBottom: 0,
                            display: 'flex'
                        }}
                    >
                        <span style={{ margin: 0 }}>
                            {t(
                                "claim:cardOverallReviewPrefix"
                            )}

                            <span
                                style={{
                                    color:
                                        ReviewColors[
                                        review?._id
                                        ] || "#000",
                                    fontWeight: "bold",
                                    textTransform:
                                        "uppercase",
                                    margin: '0px 3px'
                                }}
                            >
                                {t(
                                    `claimReviewForm:${review?._id}`
                                )}
                            </span>
                            ({0})
                        </span>
                    </Paragraph>
                </Col>
                <Col>
                    <Button
                        type={ButtonType.blue}
                        href={`/personality/${personality.slug}/claim/${claim.slug}`}
                        data-cy={personality.name}
                    >
                        <Title
                            level={4}
                            style={{
                                color: colors.white,
                                fontSize: 14,
                                fontWeight: 400,
                                margin: 0,
                                padding: 0,
                                lineHeight: '32px',
                            }}
                        >
                            {t("claim:cardReviewButton")}
                        </Title>
                    </Button>
                </Col>
            </Row>
        </CardBase>
    );
}

export default ClaimCard;
