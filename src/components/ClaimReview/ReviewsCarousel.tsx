import React, { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Comment, Skeleton, Typography } from "antd";
import AletheiaButton, { ButtonType } from "../Button";
import colors from "../../styles/colors";
import CardBase from "../CardBase";
import ClassificationText from "../ClassificationText";
import ClaimReviewApi from "../../api/claimReviewApi";
import ClaimCardHeader from "../Claim/ClaimCardHeader";
import ClaimSummary from "../Claim/ClaimSummary";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import TagsList from "./TagsList";
const { Paragraph } = Typography;

const StyledComment = styled(Comment)`
    .ant-comment-actions > li {
        width: 100%;
    }
`;
const ReviewsCarousel = () => {
    const [currIndex, setCurrIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewsList, setReviewsList] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        ClaimReviewApi.getLatestReviews().then((reviews) => {
            setReviewsList(reviews);
            setLoading(false);
        });
    }, []);

    const currentReview = reviewsList[currIndex];

    const nextCard = () => {
        if (currIndex < reviewsList.length - 1) setCurrIndex(currIndex + 1);
        else setCurrIndex(0);
    };

    const previousCard = () => {
        if (currIndex > 0) setCurrIndex(currIndex - 1);
        else setCurrIndex(reviewsList.length - 1);
    };

    return (
        <CardBase style={{ width: "fit-content" }}>
            {loading ? (
                <div style={{ flex: 1, padding: "0 30px" }}>
                    <Skeleton active paragraph={{ rows: 5 }} round={true} />
                    <div
                        style={{
                            display: "flex",
                            padding: "10px 0",
                        }}
                    >
                        <Skeleton title={false} paragraph={{ rows: 1 }} />
                        <Skeleton.Button active />
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Button type="text" onClick={previousCard}>
                        <LeftOutlined />
                    </Button>
                    <div style={{ flex: 1 }}>
                        <StyledComment
                            author={
                                <ClaimCardHeader
                                    personality={currentReview.personality}
                                    date={currentReview.claim?.date}
                                    claimType={currentReview.claim?.type}
                                />
                            }
                            content={
                                <ClaimSummary
                                    style={{
                                        padding: "12px 16px",
                                        width: "100%",
                                        height: "8.4em",
                                    }}
                                >
                                    <Paragraph
                                        style={{ marginBottom: 0 }}
                                        ellipsis={{
                                            rows: 4,
                                            expandable: false,
                                        }}
                                    >
                                        <cite
                                            style={{
                                                fontStyle: "normal",
                                                fontSize: 16,
                                                color: colors.blackPrimary,
                                            }}
                                        >
                                            {
                                                currentReview.sentenceContent
                                                    .content
                                            }
                                        </cite>
                                    </Paragraph>
                                </ClaimSummary>
                            }
                            actions={[
                                <TagsList
                                    tags={currentReview.sentenceContent.topics}
                                />,
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "8px",
                                        width: "100%",
                                    }}
                                >
                                    <span>
                                        {t("claimReview:claimReview")}
                                        <ClassificationText
                                            classification={
                                                currentReview.sentenceContent
                                                    .props.classification
                                            }
                                        />
                                    </span>
                                    <AletheiaButton
                                        type={ButtonType.blue}
                                        href={currentReview.reviewHref}
                                    >
                                        <span
                                            style={{
                                                color: colors.white,
                                                fontSize: 16,
                                                fontWeight: 400,
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: "24px",
                                            }}
                                        >
                                            Ver
                                        </span>
                                    </AletheiaButton>
                                </div>,
                            ]}
                        />
                    </div>
                    <Button type="text" onClick={nextCard}>
                        <RightOutlined />
                    </Button>
                </div>
            )}
        </CardBase>
    );
};

export default ReviewsCarousel;
