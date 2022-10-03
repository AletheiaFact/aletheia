import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import CTASection from "./CTASection";
import HomeHeaderStyle from "./HomeHeader.style";

const HomeHeader = () => {
    const { t } = useTranslation();
    const videoId = process.env.NEXT_PUBLIC_HOMEPAGE_VIDEO_ID;

    return (
        <HomeHeaderStyle>
            <Row
                className="home-header-container"
                justify="center"
                style={{
                    backgroundColor: colors.blackPrimary,
                }}
            >
                <Col
                    sm={18}
                    md={8}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h1
                        style={{
                            color: colors.white,
                            margin: 0,
                            fontSize: "clamp(26px, 3vw,40px)",
                        }}
                    >
                        {t("home:title")}
                    </h1>
                    <h2
                        style={{
                            color: colors.white,
                            margin: 0,
                            fontSize: "clamp(16px, 3vw,40px)",
                            display: "flex",
                        }}
                    >
                        <span>{t("home:subtitle0")}&nbsp;</span>
                        <span>{t("home:subtitle1")}</span>
                    </h2>
                    <CTASection />
                </Col>

                <Col sm={18} md={10}>
                    <div className="video-container">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            title="video"
                            src={`https://www.youtube.com/embed/${videoId}`}
                        />
                    </div>
                </Col>
            </Row>
            <div
                style={{
                    backgroundColor: colors.bluePrimary,
                    color: colors.white,
                    height: "87px",
                }}
            >
                stats
            </div>
        </HomeHeaderStyle>
    );
};

export default HomeHeader;
