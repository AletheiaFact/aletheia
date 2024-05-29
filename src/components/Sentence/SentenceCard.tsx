import React from "react";
import ClaimCardHeader from "../Claim/ClaimCardHeader";
import ClaimReviewCardContent from "../ClaimReview/ReviewCardCommentContent";
import TagsList from "../ClaimReview/TagsList";
import ClaimReviewCardActions from "../ClaimReview/ReviewCardActions";
import { ContentModelEnum } from "../../types/enums";
import styled from "styled-components";
import { Comment } from "antd";
import CardBase from "../CardBase";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const StyledComment = styled(Comment)`
    .ant-comment-actions > li {
        width: 100%;
    }
`;

const SentenceCard = ({ sentence }) => {
    const { content, claim, personality } = sentence;
    const contentModel = sentence?.claim[0].contentModel;
    const [nameSpace] = useAtom(currentNameSpace);
    const isImage = contentModel === ContentModelEnum.Image;
    const isSpeech = contentModel === ContentModelEnum.Speech;
    const isDebate = contentModel === ContentModelEnum.Debate;
    const isUnattributed =
        contentModel === ContentModelEnum.GenerativeInformation;

    const buildReviewHref = (
        nameSpace,
        sentence,
        personality,
        isUnattributed,
        isImage,
        isDebate
    ) => {
        const baseNamespace =
            nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";
        let pathSegment = "";

        if (isDebate) {
            pathSegment = `/claim/${sentence?.claim[0]?._id}/debate`;
        } else if (personality) {
            pathSegment = `/personality/${personality?.slug}/claim/${sentence?.claim[0]?.slug}`;
        } else {
            pathSegment = `/claim/${sentence?.claim[0]?.slug}`;
        }

        const detailPath = isImage
            ? `/image/${sentence?.data_hash}`
            : `/sentence/${sentence?.data_hash}`;

        return `${baseNamespace}${pathSegment}${detailPath}`;
    };

    let reviewHref = buildReviewHref(
        nameSpace,
        sentence,
        personality,
        isUnattributed,
        isImage,
        isDebate
    );

    return (
        <CardBase style={{ width: "fit-content", padding: "16px 32px" }}>
            <StyledComment
                author={
                    <ClaimCardHeader
                        personality={personality}
                        date={claim?.date}
                        claimType={claim?.contentModel}
                    />
                }
                content={
                    <ClaimReviewCardContent
                        isImage={isImage}
                        content={content}
                    />
                }
                actions={[
                    <TagsList key={0} tags={sentence.topics || []} />,
                    <ClaimReviewCardActions
                        key={1}
                        href={reviewHref}
                        content={sentence}
                    />,
                ]}
            />
        </CardBase>
    );
};

export default SentenceCard;
