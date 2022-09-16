import { useTranslation } from "next-i18next";
import React from "react";

import ImageUpload from "../ImageUpload";
import Loading from "../Loading";
import HomeCarousel from "./HomeCarousel";
import HomeContent from "./HomeContent";

const Home = ({ personalities, stats, href }) => {
    const { t } = useTranslation();

    if (stats) {
        return (
            <>
                <HomeCarousel personalities={personalities} stats={stats} />
                <HomeContent
                    personalities={personalities}
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
