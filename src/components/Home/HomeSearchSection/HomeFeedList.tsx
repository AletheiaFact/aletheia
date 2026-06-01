import React from "react";
import { Grid, List } from "@mui/material";
import PersonalityCard from "../../Personality/PersonalityCard";
import ClaimCard from "../../Claim/ClaimCard";
import ReviewCard from "../../ClaimReview/ReviewCard";

const HomeFeedList = ({ results }) => {
    return (
        <List className="home-feed-list">
            {results?.map((item) => (
                <Grid item className="home-feed-item" key={item._id}>
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
            ))}
        </List>
    );
};

export default HomeFeedList;
