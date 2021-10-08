import { Avatar, Button, Col, Comment, Row, Tooltip, Typography } from "antd";
import React from "react";
import { useRouter } from "next/router";
import "./ClaimCard.less";
import { useTranslation } from "react-i18next";
import ReviewColors from "../../constants/reviewColors";

const { Paragraph } = Typography;

const ClaimCard = ({ personality, claim, viewClaim }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const review = claim?.stats?.reviews[0];

    const onClickViewClaim = () => {
        const claimUrl = viewClaim(claim._id, true)
        router.push(claimUrl)
    }

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
                                    onClick={onClickViewClaim}
                                    style={{
                                        textDecoration: "underline"
                                    }}
                                >
                                    {t("claim:cardLinkToFullText")}
                                </a>
                                {/* <Link
                                    to={location =>
                                        viewClaim(
                                            claim._id,
                                            true
                                        )
                                    }
                                    style={{
                                        textDecoration: "underline"
                                    }}
                                >
                                    {t("claim:cardLinkToFullText")}
                                </Link> */}
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
                                    onClick={e => {
                                        e.stopPropagation();
                                        viewClaim(
                                            claim._id
                                        );
                                    }}
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
