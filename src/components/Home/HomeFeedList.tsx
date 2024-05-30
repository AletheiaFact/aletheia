import React from "react";
import { Col, List } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import SentenceCard from "../Sentence/SentenceCard";
import ClaimCard from "../Claim/ClaimCard";
import styled from "styled-components";

const HomeFeedListStyled = styled(List)`
    .ant-spin-nested-loading {
        width: 100%;
    }

    .ant-list-items {
        display: flex;
        flex-wrap: wrap;
        gap: 32px;
        justify-content: space-between;
    }

    .item {
        display: flex;
        height: 100%;
        flex: 1 1 250px;
    }
`;

const HomeFeedList = ({ results }) => {
    return (
        <HomeFeedListStyled
            itemLayout="horizontal"
            dataSource={results}
            style={{ width: "100%", display: "flex" }}
            renderItem={(item) => (
                <Col className="item">
                    {item && item.type === "personality" && (
                        <PersonalityCard personality={item} summarized={true} />
                    )}

                    {item && item.type === "claim" && (
                        <ClaimCard
                            personality={item?.personalities[0]}
                            claim={item}
                            content={item?.content[0]?.content}
                        />
                    )}

                    {item && item.type === "sentence" && (
                        <SentenceCard sentence={item} />
                    )}
                </Col>
            )}
        />
    );
};

export default HomeFeedList;
