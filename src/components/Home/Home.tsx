import React from "react";

import HomeContent from "./HomeContent";
import HomeHero from "./HomeHero/HomeHero";
import HomeJoinSection from "./HomeJoinSection/HomeJoinSection";
import HomeSearchSection from "./HomeSearchSection/HomeSearchSection";

const Home = ({ personalities, stats, href, claims, reviews, eventsData, enableEventsFeature }) => {
    return (
        <>
            <HomeHero stats={stats} />
            <HomeSearchSection />
            <HomeContent
                personalities={personalities}
                debateClaims={claims}
                reviews={reviews}
                eventsData={eventsData}
                enableEventsFeature={enableEventsFeature}
            />
            <HomeJoinSection href={href} />
        </>
    );
};

export default Home;
