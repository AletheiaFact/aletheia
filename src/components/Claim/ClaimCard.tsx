import { Avatar, Button, Col, Comment, Row, Tooltip, Typography } from "antd";
import React from "react";
import "./ClaimCard.less";
import { useTranslation } from "react-i18next";
import ReviewColors from "../../constants/reviewColors";

const { Paragraph } = Typography;

const ClaimCard = ({ personality, claim }) => {
    const { t } = useTranslation();
    const review = claim?.stats?.reviews[0];

    if (!claim) {
        return <div></div>;
    }

    return (
        <Col span={24}>
            <Comment
                // review="true"
                author={personality.name}
                avatar={
                    <Avatar
                        src={personality.image}
                        alt={personality.name}
                    />
                }
                content={
                    <>
                        <Row className="claim-summary">
                            <Col>
                                <Paragraph
                                    ellipsis={{
                                        rows: 4,
                                        expandable: false
                                    }}
                                >
                                    "
                                    {claim.content.text ||
                                        claim.title}
                                    "
                                </Paragraph>
                                <a
                                    href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                    style={{
                                        textDecoration: "underline"
                                    }}
                                >
                                    {t("claim:cardLinkToFullText")}
                                </a>
                            </Col>
                        </Row>
                        <Row>
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
                                    shape="round"
                                    type="primary"
                                    href={`/personality/${personality.slug}/claim/${claim.slug}`}
                                >
                                    {t("claim:cardReviewButton")}
                                </Button>
                            </Col>
                        </Row>
                    </>
                }
                datetime={
                    <Tooltip title={claim?.date}>
                        <span>{claim?.date}</span>
                    </Tooltip>
                }
            />
          <hr style={{ opacity: "20%" }} />
      </Col>
  );
}

export default ClaimCard;
