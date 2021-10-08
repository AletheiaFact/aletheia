import { Avatar, Col, Comment, Row, Tooltip, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const ClaimSummary = styled(Row)`
    position: relative;
    background: #EEEEEE;
    display:flex;
    padding: 12px 0px 0px 16px;
    margin: 1em auto;
    border-radius:10px;

    &:after
    {
        content: " ";
        position: absolute;
        left: 10px;
        top: -12px;
        border-top: none;
        border-right: 12px solid transparent;
        border-left: 12px solid transparent;
        border-bottom: 12px solid #EEEEEE;
    }
`;

const { Paragraph } = Typography;
const ClaimSentenceCard = ({ personality, sentence}) => {
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
                            <ClaimSummary>
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
                <hr style={{ opacity: "20%" }} />
            </Col>
        );
    } else {
        return <></>;
    }
}

export default ClaimSentenceCard;
