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
import { generateContentPath } from "../../utils/GetContentHref";

const StyledComment = styled(Comment)`
    .ant-comment-actions > li {
        width: 100%;
    }
`;

const SentenceCard = ({ sentence }) => {
    const {
        content,
        claim: [claim],
        personality: [personality],
    } = sentence;
    const contentModel = sentence?.claim[0]?.contentModel;
    const [nameSpace] = useAtom(currentNameSpace);
    const isImage = contentModel === ContentModelEnum.Image;

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
                        href={generateContentPath(
                            nameSpace,
                            personality,
                            claim,
                            contentModel,
                            sentence.data_hash
                        )}
                        content={sentence}
                    />,
                ]}
            />
        </CardBase>
    );
};

export default SentenceCard;
