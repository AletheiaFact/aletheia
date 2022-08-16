import { Col, Comment } from "antd";
import React from "react";
import styled from "styled-components";

import AletheiaAvatar from "../AletheiaAvatar";
import ClaimCardHeader from "../Claim/ClaimCardHeader";
import ClaimSummary from "../Claim/ClaimSummary";
import TopicInput from "./TopicInput";

const StyledComment = styled(Comment)`
    .ant-comment-avatar {
        img {
            width: 100%;
            height: 100%;
        }
    }

    ul.ant-comment-actions li {
        width: 100%;
    }
`;

const ClaimSentenceCard = ({
    personality,
    date,
    sentence,
    claimType,
    summaryClassName = "",
}) => {
    const content = sentence?.content;
    const data_hash = sentence?.data_hash;
    const topics = sentence?.topics;

    if (content) {
        return (
            <Col span={24}>
                <StyledComment
                    author={
                        <ClaimCardHeader
                            personality={personality}
                            date={date}
                            claimType={claimType}
                        />
                    }
                    avatar={
                        <AletheiaAvatar
                            src={personality.avatar}
                            alt={personality.name}
                            size={43}
                        />
                    }
                    content={
                        <>
                            <ClaimSummary className={summaryClassName}>
                                <Col>
                                    <cite
                                        style={{
                                            marginBottom: "1em",
                                            fontStyle: "normal",
                                        }}
                                    >
                                        <p>{content}</p>
                                    </cite>
                                </Col>
                            </ClaimSummary>
                        </>
                    }
                    actions={[
                        <TopicInput
                            sentence_hash={data_hash}
                            topics={topics}
                        />,
                    ]}
                />
            </Col>
        );
    } else {
        return <></>;
    }
};

export default ClaimSentenceCard;
