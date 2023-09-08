import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import AletheiaVideo from "../AletheiaVideo";
import CTASection from "./CTASection";
import HomeHeaderStyle from "./HomeHeader.style";
import { useAppSelector } from "../../store/store";

const HomeHeader = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);

    return (
        <HomeHeaderStyle>
            <Row
                className="home-header-container"
                justify="center"
                style={{
                    backgroundColor: colors.blackPrimary,
                    alignItems: "center",
                }}
            >
                <Col
                    sm={18}
                    md={8}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: vw?.sm ? "0" : "20px",
                        width: "100%",
                    }}
                >
                    <Col sm={24} className="home-header-title">
                        <h1
                            style={{
                                color: colors.white,
                                margin: 0,
                            }}
                        >
                            {t("home:title")}
                        </h1>
                        <h2
                            style={{
                                color: colors.white,
                                margin: 0,
                                display: "flex",
                            }}
                        >
                            {!vw?.sm ? (
                                <>
                                    <span>{t("home:subtitle0")}&nbsp;</span>
                                    <span>{t("home:subtitle1")}</span>
                                </>
                            ) : (
                                <span>
                                    {t("home:subtitle0")} {t("home:subtitle1")}
                                </span>
                            )}
                        </h2>
                    </Col>
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
