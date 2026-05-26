import React from "react";
import { Grid, List } from "@mui/material";
import PersonalityCard from "../Personality/PersonalityCard";
import ClaimCard from "../Claim/ClaimCard";
import styled from "styled-components";
import ReviewCard from "../ClaimReview/ReviewCard";
import { queries } from "../../styles/mediaQueries";

const HomeFeedListStyled = styled(List)`
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        width: 100%;

    .item {
        display: flex;
        flex-direction: column;
        width: calc(33% - 6px);

        @media ${queries.md} {
            width: calc(50% - 6px);
        }

        @media ${queries.sm} {
            width: 100%;
        }
    }
`;

const HomeFeedList = ({ results }) => {
    return (
        <HomeFeedListStyled>
            {results?.map((item) => (
                <Grid item className="item" key={item._id}>
                    {item && item.type === "personality" && (
                        <PersonalityCard
                            personality={item}
                            summarized={true}
                            style={{ height: "auto" }}
                        />
                    )}

                    {item && item.type === "claim" && (
                        <ClaimCard
                            personality={item?.personalities[0]}
                            claim={item}
                            content={item?.content[0]?.content}
                        />
                    )}

                    {item && item.type === "sentence" && (
                        <ReviewCard
                            review={{
                                personality: item?.personality,
                                claim: item?.claim,
                                content: {
                                    content: item.content,
                                    ...item,
                                },
                            }}
                            summarized={true}
                        />
                    )}
                </Grid>
            ))
            }
        </HomeFeedListStyled>
    );
};

export default HomeFeedList;
