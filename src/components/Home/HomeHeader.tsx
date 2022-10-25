import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import AletheiaVideo from "../AletheiaVideo";
import CTASection from "./CTASection";
import HomeHeaderStyle from "./HomeHeader.style";

const HomeHeader = () => {
    const { t } = useTranslation();

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
                        paddingLeft: "20px",
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
                        <AletheiaVideo />
                    </div>
                </Col>
            </Row>
        </HomeHeaderStyle>
    );
};

export default HomeHeader;
