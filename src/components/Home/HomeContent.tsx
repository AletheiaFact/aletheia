import React from "react";
import CTAFolder from "./CTAFolder/CTAFolder";
import { Grid } from "@mui/material"
import SocialMediaShare from "../SocialMediaShare";
import PersonalitiesGrid from "../Personality/PersonalitiesGrid";
import { useTranslation } from "next-i18next";
import DebateGrid from "../Debate/DebateGrid";
import HomeReviewsSection from "./HomeReviewsSection/HomeReviewsSection";
import EventsGrid from "../Event/EventList/EventGrid";

const HomeContent = ({ personalities, href, title, debateClaims, reviews, eventsData, enableEventsFeature }) => {
    const { t } = useTranslation();

    return (
        <>
            <Grid container>
                <Grid item xs={12} id="latest-reviews">
                    <HomeReviewsSection reviews={reviews} />
                </Grid>

                <Grid item xs={12}>
                    <PersonalitiesGrid
                        personalities={personalities}
                        title={title}
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
                            justifyItems: "center",
                        }}
                    >
                        <DebateGrid debates={debateClaims} />
                    </Grid>
                )}

                {enableEventsFeature && eventsData && (
                    <Grid item xs={11} sm={11} md={9}>
                        <EventsGrid
                            events={eventsData.events}
                            eventMetrics={eventsData.eventMetrics}
                            t={t}
                            title={t("events:latestEvents")}
                        />
                    </Grid>
                )}

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
