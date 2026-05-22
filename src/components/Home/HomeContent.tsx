import React from "react";
import CTAFolder from "./CTAFolder/CTAFolder";
import { Grid } from "@mui/material"
import SocialMediaShare from "../SocialMediaShare";
import HomePersonalitiesSection from "./HomePersonalitiesSection/HomePersonalitiesSection";
import HomeDebatesSection from "./HomeDebatesSection/HomeDebatesSection";
import HomeEventsSection from "./HomeEventsSection/HomeEventsSection";
import HomeReviewsSection from "./HomeReviewsSection/HomeReviewsSection";

const HomeContent = ({ personalities, href, debateClaims, reviews, eventsData, enableEventsFeature }) => {
    return (
        <>
            <Grid container>
                <Grid item xs={12} id="latest-reviews">
                    <HomeReviewsSection reviews={reviews} />
                </Grid>

                <Grid item xs={12}>
                    <HomePersonalitiesSection personalities={personalities} />
                </Grid>

                {enableEventsFeature && eventsData && (
                    <Grid item xs={12}>
                        <HomeEventsSection
                            events={eventsData.events}
                            eventMetrics={eventsData.eventMetrics}
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    <HomeDebatesSection debates={debateClaims} />
                </Grid>

                <Grid item xs={11} sm={11} md={9} order={3}>
                    <CTAFolder />
                </Grid>

                <Grid item xs={12} order={4}>
                    <SocialMediaShare href={href} />
                </Grid>
            </Grid>
        </>
    );
};

export default HomeContent;
