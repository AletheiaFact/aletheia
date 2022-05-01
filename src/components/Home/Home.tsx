import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Carousel, Spin, Col } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import { ArrowRightOutlined } from "@ant-design/icons";
import colors from "../../styles/colors";
import SectionTitle from "../SectionTitle";

import styled from "styled-components";

const HomeContainer = styled.div`
    .header-content-container {
        display: flex;
        flex-wrap: wrap;
    }

    .home-title-container {
        margin: 64px 0 32px 0;
    }

    .home-title,
    .home-subtitle {
        width: 100%;
        color: ${colors.white};
        font-size: 40px;
        line-height: 48px;
        margin: 0;
    }

    .home-subtitle0,
    .home-subtitle1 {
        display: block;
    }

    .footer-container {
        display: grid;
        grid-template-rows: 52px 72px;
        width: 100%;
    }

    .home-footer-title {
        color: ${colors.white};
        font-size: 16px;
        line-height: 20px;
        margin-bottom: 0;
    }

    .create-account-button {
        width: 185px;
        height: 40px;
        display: flex;
        padding: 0;
        justify-content: center;
        align-items: center;
    }

    .stats-container {
        flex-direction: row;
        color: ${colors.white};
        width: 100%;
        justify-content: space-between;
        height: 55px;
    }

    .stats-text {
        display: flex;
        align-items: center;
        margin-bottom: 0;
    }
    
    .number-stats {
        color: ${colors.lightBlueSecondary};
        font-size: 40px;
        line-height: 55px;
        margin-right: 20px;
    }

    .title-stats {
        font-size: 20px;
    }

    .main-content {
        padding-top: 32px;
    }

    .personality-card {
        display: flex;
        flex-wrap: wrap;
        margin-right: 10px;
    }

    .more-personalities-container {
        margin: 48px 0 64px 0;
        display: flex;
        justify-content: center;
    }

    .join-container {
        margin-left: 20px;
    }
    
    @media (min-width: 1370px) {
        .personality-card {
            flex: 1 1 326.75px;
            max-width: 450px;
        }
    }
    
    @media (max-width: 1369px) {
        .personality-card {
            flex: 1 1 326.75px;
        }
    }
    
    @media (min-width: 1171px) {
        .footer-container .ant-col-14 {
            max-width: 100%;
        }
    }

    @media (max-width: 1170px) {
        .home-title-container {
            margin: 32px 0 16px 0;
        }

        .footer-container {
            order: 3;
            display: flex;
        }
        
        .stats-container {
            order: 2;
            flex-direction: column;
            margin: 0 0 16px 0;
            height: auto;
        }
        
        .ant-col-7.stats-child-container {
            max-width: 100%;
            margin-left: 0;
        }
    }
    
    @media (max-width: 1024px) {        
        .main-content {
            display: grid;
            grid-template-columns: 1fr;
        }        
        
        .ant-col-12.personalities-container {
            display: block;
            flex: 0 0 50%;
            max-width: 75%;
        }
        
        .more-personalities-container {
            margin: 16px 0 32px 0;
        }
        

        .join-container {
            margin-left: 12.5%;
            max-width: 75%;
        }
    }
    
    @media (max-width: 950px) {
        .ant-col-offset-4.header-content-container {
            margin-left: 12.5%;
            max-width: 75%;
        }
    }
    
    @media (max-width: 900px) {
        .header-container {
            max-width: 80%;
            margin-left: 10%;
        }

        .home-title,
        .home-subtitle {
            font-size: 36px;
            line-height: 42px;
        }

        .ant-col-offset-4.header-content-container,
        .ant-col-12.personalities-container,
        .join-container {
            margin-left: 8.33333333%;
            max-width: 83.333334%;
        }

        .footer-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .home-footer-title {
            margin-bottom: 0;
        }
    }

    @media (max-width: 800px) {
        .ant-col-offset-4.header-content-container {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
            
        }
    }

    @media (max-width: 725px) {
        .ant-col-offset-4.header-content-container {
            margin-left: 0;
        }

        .ant-col-12.personalities-container,
        .join-container {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }
    }

    @media (max-width: 610px) {
        .home-subtitle {
            width: 100%;
        }   
        
        .footer-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr
        }

        .footer-container .ant-col-14 {
            max-width: 100%;
        }

        .create-account-container {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }
    }

    @media (max-width: 548px) {
        .ant-col-offset-4.header-content-container {
            max-width: 100%;
        }

        .home-title-container {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .home-title,
        .home-subtitle {
            width: 100%;
            text-align: center;
            font-size: 16px;
            line-height: 38px;
        }

        .home-title {
            font-size: 26px;
        }

        .home-subtitle {
            font-size: 16px;
        }

        .home-subtitle0,
        .home-subtitle1 {
            display: inline;
        }

        .stats-container,
        .create-account-container {
            margin-bottom: 32px;
        }

        .number-stats {
            font-size: 34px;
        }

        .title-stats {
            font-size: 16px;
        }

        .home-footer-title {
            font-size: 12px;
            font-weight: 700;
        }

        .create-account-button {
            width: 150px;
        }

        .ant-col-12.personalities-container,
        .section-join-title {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }

        .join-container {
            margin-left: 0;
            max-width: 100%;
        }
    }
`

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
                                <Row
                                    className="home-title-container"
                                    style={{
                                        color: colors.white,
                                    }}
                                >
                                    <h1 className="home-title">
                                        {t("home:title")}
                                    </h1>
                                    <h2 className="home-subtitle">
                                        <span className="home-subtitle0">{t("home:subtitle0")}</span>{" "}
                                        <span className="home-subtitle1">{t("home:subtitle1")}</span>
                                    </h2>
                                </Row>
                                {  !isLoggedIn  &&
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
                                
                                <Row className="stats-container">
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
                <Row className="main-content">
                    <Col
                        span={12}
                        offset={3}
                        className="personalities-container"
                    >
                        <Col>
                            <SectionTitle>
                                {t("home:sectionTitle1")}
                            </SectionTitle>
                            <Col
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between"
                                }}
                            >
                                {personalities.map(
                                    (p, i) =>
                                        p && (
                                            <Col
                                                className="personality-card"
                                            >
                                                <PersonalityCard
                                                    personality={p}
                                                    summarized={true}
                                                    key={p._id}
                                                />
                                            </Col>
                                        )
                                )}
                            </Col>
                            <Col className="more-personalities-container">
                                <Button
                                    href="/personality"
                                    type={ButtonType.whiteBlue}
                                    style={{
                                        paddingBottom: 0,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "14px",
                                            lineHeight: "15px",
                                        }}
                                    >
                                        {t("home:seeMorePersonalitiesButton")} <ArrowRightOutlined />
                                    </span>
                                </Button>
                            </Col>
                        </Col>
                    </Col>
                    <Col span={6} className="join-container">
                        <Row className="section-join-title">
                            <SectionTitle>
                                {t("home:sectionTitle2")}
                            </SectionTitle>
                        </Row>

                        <Row id="create_account">
                            {!isLoggedIn && <CTARegistration></CTARegistration>}
                        </Row>
                        <SocialMediaShare href={href} />
                    </Col>
                </Row>
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
