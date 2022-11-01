import { useTranslation } from "next-i18next";
import React from "react";

import Loading from "../Loading";
import HomeContent from "./HomeContent";
import HomeHeader from "./HomeHeader";
import HomeStats from "./HomeStats";

const Home = ({ personalities, stats, href, claimCollections }) => {
    const { t } = useTranslation();

    if (stats) {
        return (
            <>
                <HomeHeader />
                <HomeStats stats={stats} />
                <HomeContent
                    personalities={personalities}
                    claimCollections={claimCollections}
                    href={href}
                    title={t("home:sectionTitle1")}
                />
            </>
        );
    } else {
        return <Loading />;
    }
};

export default Home;
