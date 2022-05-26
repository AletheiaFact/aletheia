import React from "react";
import { Row, Carousel, Spin, Col } from "antd";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import colors from "../../styles/colors";
import HomeContainer from "./Home.style";
import HomeContent from "./HomeContent";

const Home = ({ personalities, stats, href, isLoggedIn }) => {
    const { t } = useTranslation();

    if (stats) {
        return (
            <HomeContainer>
                <Row
                    style={{
                        position: "relative",
                        margin: "-20px 0px 0px 0",
                    }}
                >
                    <Col
                        span={24}
                        style={{
                            height: "443px",
                            overflow: "hidden",
                            position: "relative"
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                zIndex: 1,
                                backgroundColor: "rgba(0,0,0,0.6)"
                            }}
                        ></div>
                        <Carousel autoplay dots={false}>
                            {personalities.map(
                                (p, i) =>
                                    p && (
                                        <div key={i}>
                                            <img
                                                alt={t('seo:personalityImageAlt', { name: p.name })}
                                                style={{
                                                    height: "auto",
                                                    color: colors.white,
                                                    lineHeight: "160px",
                                                    textAlign: "center",
                                                    background: "#364d79",
                                                    width: "100%",
                                                    filter: "grayscale(100%)"
                                                }} //precisa ajustar as imagens
                                                src={p.image}
                                            />
                                        </div>
                                    )
                            )}
                        </Carousel>
                    </Col>
                    <div
                        style={{
                            position: "absolute",
                            zIndex: 2,
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Col
                            span={18}
                            offset={3}
                            className="header-container"
                        >
                            <Col
                                offset={4}
                                span={16}
                                className="header-content-container"
                            >
                                <Row className="home-title-container">
                                    <h1 className="home-title">
                                        {t("home:title")}
                                    </h1>
                                    <h2 className="home-subtitle">
                                        <span className="home-subtitle0">{t("home:subtitle0")}</span>{" "}
                                        <span className="home-subtitle1">{t("home:subtitle1")}</span>
                                    </h2>
                                </Row>
                                {!isLoggedIn &&
                                    <Row className="footer-container">
                                        <Col
                                            span="14"
                                            className="home-footer-title-container"
                                        >
                                            <h2 className="home-footer-title">
                                                {t("home:statsFooter")}
                                            </h2>
                                        </Col>
                                        <Row
                                            style={{
                                                height: "15%",
                                                color: "#fff",
                                                justifyContent: "space-between",
                                                marginBottom: "32px",
                                            }}
                                            gutter={3}
                                        >
                                            <Col className="create-account-container">
                                                <Button
                                                    href="#create_account"
                                                    type={ButtonType.white}
                                                    className="create-account-button"
                                                >
                                                    <span style={{ fontWeight: 700 }}>
                                                        {t("home:createAccountButton")}
                                                    </span>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                }
                                {
                                    isLoggedIn &&
                                    <Row className="footer-container">
                                        <h2 className="home-footer-title">
                                            {t("home:statsFooter")}
                                        </h2>
                                    </Row>
                                }

                                <Row className="stats-container" style={{border: "1px solid red"}}>
                                    <Col
                                        span={7}
                                        className="stats-child-container"
                                    >
                                        <p className="stats-text">
                                            <span className="number-stats">
                                                {stats.personalities}
                                            </span>{" "}
                                            <span className="title-stats">
                                                {t("home:statsPersonalities")}
                                            </span>
                                        </p>
                                    </Col>
                                    <Col
                                        span={7}
                                        offset={2}
                                        className="stats-child-container"
                                    >
                                        <p className="stats-text">
                                            <span className="number-stats">
                                                {stats.claims}
                                            </span>{" "}
                                            <span className="title-stats">
                                                {t("home:statsClaims")}
                                            </span>
                                        </p>
                                    </Col>
                                    <Col
                                        span={7}
                                        offset={1}
                                        className="stats-child-container"
                                    >
                                        <p className="stats-text">
                                            <span className="number-stats">
                                                {stats.reviews}
                                            </span>{" "}
                                            <span className="title-stats">
                                                {t("home:statsClaimReviews")}
                                            </span>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </div>
                </Row>
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
