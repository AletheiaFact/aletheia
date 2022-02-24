import { Avatar, Col, Comment, Typography } from "antd";
import React from "react";
import ClaimCardHeader from "../Claim/ClaimCardHeader";
import ClaimSummary from "../Claim/ClaimSummary";


const { Paragraph } = Typography;
const ClaimSentenceCard = ({ personality, sentence, claimType, summaryClassName = "" }) => {
    const content = sentence?.content;

    if (content) {
        return (
            <Col span={24}>
                <Comment
                    author={
                        <ClaimCardHeader
                            personality={personality}
                            date={sentence?.date}
                            claimType={claimType}
                        />
                    }
                    avatar={
                        <Avatar
                            src={personality.image}
                            alt={personality.name}
                        />
                    }
                    content={
                        <>
                            <ClaimSummary className={summaryClassName}>
                                <Col>
                                    <Paragraph>
                                        {content}
                                    </Paragraph>
                                </Col>
                            </ClaimSummary>
                        </>
                    }
                />
            </Col>
        );
    } else {
        return <></>;
    }
}

export default ClaimSentenceCard;
