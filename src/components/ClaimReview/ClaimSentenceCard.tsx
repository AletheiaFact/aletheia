import { Avatar, Col, Comment } from "antd";
import React from "react";
import colors from "../../styles/colors";
import ClaimCardHeader from "../Claim/ClaimCardHeader";
import ClaimSummary from "../Claim/ClaimSummary";

const ClaimSentenceCard = ({
    personality,
    sentence,
    claimType,
    summaryClassName = "",
}) => {
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
                            size={43}
                            style={{
                                outlineColor: colors.blueQuartiary,
                                outlineStyle: "solid",
                                outlineWidth: "1.5px",
                                outlineOffset: "2px",
                            }}
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
                />
            </Col>
        );
    } else {
        return <></>;
    }
};

export default ClaimSentenceCard;
