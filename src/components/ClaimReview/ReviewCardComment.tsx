import React from "react";
import { Comment } from "antd";
import ClaimCardHeader from "../Claim/ClaimCardHeader";
import styled from "styled-components";
import TagsList from "./TagsList";
import { ContentModelEnum } from "../../types/enums";
import ReviewCardCommentContent from "./ReviewCardCommentContent";
import ReviewCardActions from "./ReviewCardActions";

const StyledComment = styled(Comment)`
    .ant-comment-actions > li {
        width: 100%;
    }
`;

const ClaimReviewCard = ({ review, ...props }) => {
    const { reviewHref, content, claim, personality } = review;
    const isImage = review?.claim.contentModel === ContentModelEnum.Image;

    return (
        <div style={{ flex: 1 }} {...props}>
            <StyledComment
                author={
                    <ClaimCardHeader
                        personality={personality}
                        date={claim?.date}
                        claimType={claim?.contentModel}
                    />
                }
                content={
                    <ReviewCardCommentContent
                        isImage={isImage}
                        content={content?.content}
                    />
                }
                actions={[
                    <TagsList key={0} tags={review.content.topics || []} />,
                    <ReviewCardActions
                        key={1}
                        href={reviewHref}
                        content={content}
                    />,
                ]}
            />
        </div>
    );
};

export default ClaimReviewCard;
