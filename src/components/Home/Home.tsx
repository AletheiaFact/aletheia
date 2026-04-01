import { useTranslation } from "next-i18next";
import React from "react";

import HomeContent from "./HomeContent";
import HomeHeader from "./HomeHeader/HomeHeader";

const Home = ({ personalities, stats, href, claims, reviews, eventsData, enableEventsFeature }) => {
    const { t } = useTranslation();

    return (
        <>
            <HomeHeader stats={stats} />
            <HomeContent
                personalities={personalities}
                debateClaims={claims}
                reviews={reviews}
                eventsData={eventsData}
                enableEventsFeature={enableEventsFeature}
                href={href}
                title={t("home:sectionTitle1")}
            />
        </>
    );
};

export default Home;
