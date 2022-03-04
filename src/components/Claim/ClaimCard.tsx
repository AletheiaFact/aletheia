import { Avatar, Col, Comment, Row, Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import ReviewColors from "../../constants/reviewColors";
import CardBase from "../CardBase";
import ClaimSummary from "./ClaimSummary";
import Button, { ButtonType } from "../Button";
import ClaimCardHeader from "./ClaimCardHeader";

const { Paragraph } = Typography;

const ClaimCard = ({ personality, claim }) => {
    const { t } = useTranslation();
    const review = claim?.stats?.reviews[0];

    if (!claim) {
        return <div></div>;
    }
    return (
        <CardBase>
            <Row>
                <Comment
                    style={{
                        padding: "15px 15px 0px 15px"
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
                                padding: "15px"
                            }}
                        >
                            <Col>
                                <Col>
                                    <Paragraph
                                        ellipsis={{
                                            rows: 4,
                                            expandable: false
                                        }}
                                    >
                                        {claim?.content?.text || claim?.title}
                                    </Paragraph>
                                </Col>
                                <a
                                    href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                    style={{
                                        textDecoration: "underline"
                                    }}
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
            >
                <Col span={16}>
                    <span
                        style={{
                            fontSize: "14px"
                        }}
                    >
                        {t("claim:metricsHeaderInfo", {
                            totalReviews: claim
                                ?.stats?.total
                        })}
                    </span>{" "}
                    <br />
                    {review && (
                        <span
                            style={{
                                fontSize: "10px"
                            }}
                        >
                            {t(
                                "claim:cardOverallReviewPrefix"
                            )}{" "}
                            <span
                                style={{
                                    color:
                                        ReviewColors[
                                        review?._id
                                        ] || "#000",
                                    fontWeight: "bold",
                                    textTransform:
                                        "uppercase"
                                }}
                            >
                                {t(
                                    `claimReviewForm:${review?._id}`
                                )}{" "}
                            </span>
                            ({review.count})
                        </span>
                    )}
                </Col>
                <Col span={8}>
                    <Button
                        style={{
                            width: "100%"
                        }}
                        type={ButtonType.blue}
                        href={`/personality/${personality.slug}/claim/${claim.slug}`}
                    >
                        {t("claim:cardReviewButton")}
                    </Button>
                </Col>
            </Row>
        </CardBase>
    );
}

export default ClaimCard;
