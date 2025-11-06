import { useTranslation } from "next-i18next";
import React from "react";

import HomeContent from "./HomeContent";
import HomeHeader from "./HomeHeader/HomeHeader";
import Cop30Section from "./COP30/Cop30Section";

const Home = ({ personalities, stats, href, claims, reviews }) => {
    const { t } = useTranslation();

    return (
        <>
            <HomeHeader stats={stats} />
            <Cop30Section />
            <HomeContent
                personalities={personalities}
                debateClaims={claims}
                reviews={reviews}
                href={href}
                title={t("home:sectionTitle1")}
            />
        </>
    );
};

export default Home;
