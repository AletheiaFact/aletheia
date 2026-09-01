import React from "react";
import { Grid } from "@mui/material";
import HomePersonalitiesSection from "./HomePersonalitiesSection/HomePersonalitiesSection";
import HomeDebatesSection from "./HomeDebatesSection/HomeDebatesSection";
import HomeEventsSection from "./HomeEventsSection/HomeEventsSection";
import HomeReviewsSection from "./HomeReviewsSection/HomeReviewsSection";

const HomeContent = ({
    personalities,
    debateClaims,
    reviews,
    eventsData,
    enableEventsFeature,
}) => {
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
            </Grid>
        </>
    );
};

export default HomeContent;
