import React, { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Comment, Typography } from "antd";
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
import ReviewCarouselSkeleton from "../Skeleton/ReviewCarouselSkeleton";
import { ContentModelEnum } from "../../types/enums";
import ImageClaim from "../ImageClaim";
const { Paragraph } = Typography;

const StyledComment = styled(Comment)`
    .ant-comment-actions > li {
        width: 100%;
    }
`;
const ReviewsCarousel = () => {
    const [currIndex, setCurrIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewsList, setReviewsList] = useState([]);
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        ClaimReviewApi.getLatestReviews().then((reviews) => {
            setReviewsList(reviews);
            setLoading(false);
        });
    }, []);

    const currentReview = reviewsList[currIndex];
    const isImage =
        currentReview?.claim.contentModel === ContentModelEnum.Image;

    const nextCard = () => {
        if (currIndex < reviewsList.length - 1) setCurrIndex(currIndex + 1);
        else setCurrIndex(0);
    };

    const previousCard = () => {
        if (currIndex > 0) setCurrIndex(currIndex - 1);
        else setCurrIndex(reviewsList.length - 1);
    };

    if (loading) {
        return <ReviewCarouselSkeleton />;
    }

    return (
        <CardBase style={{ width: "fit-content" }}>
            {reviewsList.length > 0 ? (
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
                                    claimType={
                                        currentReview.claim?.contentModel
                                    }
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
                                            {isImage ? (
                                                <ImageClaim
                                                    src={
                                                        currentReview.content
                                                            .content
                                                    }
                                                />
                                            ) : (
                                                currentReview.content.content
                                            )}
                                        </cite>
                                    </Paragraph>
                                </ClaimSummary>
                            }
                            actions={[
                                <TagsList
                                    tags={currentReview.content.topics || []}
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
                                                currentReview.content.props
                                                    .classification
                                            }
                                        />
                                    </span>
                                    <AletheiaButton
                                        type={ButtonType.blue}
                                        href={currentReview?.reviewHref}
                                        onClick={() => setIsButtonLoading(true)}
                                        loading={isButtonLoading}
                                    >
                                        <span
                                            style={{
                                                color: colors.white,
                                                fontSize: 12,
                                                fontWeight: 400,
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: "24px",
                                            }}
                                        >
                                            {t("home:reviewsCarouselOpen")}
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
            ) : (
                <></>
            )}
        </CardBase>
    );
};

export default ReviewsCarousel;
