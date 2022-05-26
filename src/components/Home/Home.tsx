import React from "react";
import { Spin } from "antd";
import { useTranslation } from 'next-i18next';
import HomeContainer from "./Home.style";
import HomeContent from "./HomeContent";
import HomeCarousel from "./HomeCarousel";

const Home = ({ personalities, stats, href, isLoggedIn }) => {
    const { t } = useTranslation();

    if (stats) {
        return (
            <HomeContainer>
                <HomeCarousel
                    personalities={personalities}
                    isLoggedIn={isLoggedIn}
                    stats={stats}
                />
                <HomeContent
                    personalities={personalities}
                    href={href}
                    isLoggedIn={isLoggedIn}
                />
            </HomeContainer>
        );
    } else {
        return (
            <Spin
                tip={t("common:loading")}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "calc(50% - 40px)"
                }}
            ></Spin>
        );
    }
}

export default Home;
