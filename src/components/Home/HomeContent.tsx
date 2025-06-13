import React from "react";
import CTARegistration from "./CTARegistration";
import { Grid } from "@mui/material"
import SocialMediaShare from "../SocialMediaShare";
import PersonalitiesGrid from "../Personality/PersonalitiesGrid";
import { useAppSelector } from "../../store/store";
import { useTranslation } from "next-i18next";
import DebateGrid from "../Debate/DebateGrid";
import HomeFeed from "./HomeFeed";
import ReviewsGrid from "../ClaimReview/ReviewsGrid";

const HomeContent = ({ personalities, href, title, debateClaims, reviews }) => {
    const { results } = useAppSelector((state) => ({
        results: [
            state?.search?.searchResults?.personalities || [],
            state?.search?.searchResults?.claims || [],
            state?.search?.searchResults?.sentences || [],
        ],
    }));

    const { t } = useTranslation();

    return (
        <>
            <Grid container
                style={{
                    width: "100%",
                    paddingTop: "32px",
                    justifyContent: "center",
                }}
            >
                <Grid item xs={11} sm={11} md={9}>
                    <HomeFeed searchResults={results} />
                </Grid>
                <Grid item xs={11} sm={11} md={9} style={{ marginBottom: 32 }}>
                    <ReviewsGrid
                        reviews={reviews}
                        title={t("home:latestReviewsTitle")}
                    />
                </Grid>
                {Array.isArray(debateClaims) && debateClaims.length > 0 && (
                    <Grid item
                        order={1}
                        xs={10}
                        sm={10}
                        md={9}
                        style={{
                            width: "100%",
                            paddingBottom: "32px",
                            justifyContent: "center",
                        }}
                    >
                        <DebateGrid debates={debateClaims} />
                    </Grid>
                )}
                <Grid item xs={11} sm={11} md={9}>
                    <PersonalitiesGrid
                        personalities={personalities}
                        title={title}
                    />
                </Grid>


                <Grid item xs={12} lg={9} order={3}>
                    <CTARegistration />
                </Grid>

                <Grid item xs={12} order={4}>
                    <SocialMediaShare href={href} />
                </Grid>
            </Grid>
        </>
    );
};

export default HomeContent;
