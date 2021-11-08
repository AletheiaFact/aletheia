import { Avatar, Col, Comment, Row, Tooltip, Typography } from "antd";
import React from "react";
import ClaimSummary from "../Claim/ClaimSummary";


const { Paragraph } = Typography;
const ClaimSentenceCard = ({ personality, sentence, summaryClassName = "" }) => {
    const content = sentence?.content;
    if (content) {
        return (
            <Col span={24}>
                <Comment
                    review="true"
                    author={personality.name}
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
                                    <Paragraph
                                        ellipsis={{
                                            rows: 4,
                                            expandable: false
                                        }}
                                    >
                                        {content}
                                    </Paragraph>
                                </Col>
                            </ClaimSummary>
                        </>
                    }
                    datetime={
                        <Tooltip title={sentence?.date}>
                            <span>{sentence?.date}</span>
                        </Tooltip>
                    }
                />
            </Col>
        );
    } else {
        return <></>;
    }
}

export default ClaimSentenceCard;
