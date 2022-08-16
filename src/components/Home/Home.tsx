import React from "react";
import { Spin } from "antd";
import { useTranslation } from "next-i18next";
import HomeContent from "./HomeContent";
import HomeCarousel from "./HomeCarousel";

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
        return (
            <Spin
                tip={t("common:loading")}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "calc(50% - 40px)",
                }}
            />
        );
    }
};

export default Home;
