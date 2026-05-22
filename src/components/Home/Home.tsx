import React from "react";

import HomeContent from "./HomeContent";
import HomeHero from "./HomeHero/HomeHero";

const Home = ({ personalities, stats, href, claims, reviews, eventsData, enableEventsFeature }) => {
    return (
        <>
            <HomeHero stats={stats} />
            <HomeContent
                personalities={personalities}
                debateClaims={claims}
                reviews={reviews}
                eventsData={eventsData}
                enableEventsFeature={enableEventsFeature}
                href={href}
            />
        </>
    );
};

export default Home;
