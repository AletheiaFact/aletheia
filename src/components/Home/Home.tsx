import React from "react";
import CTARegistration from "./CTARegistration";
import { Button, Row, Carousel, Spin } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from 'next-i18next';

const Home = ({ personalities, stats, href }) => {
    const { t } = useTranslation();

    const contentStyle = {
        height: "auto",
        color: "#fff",
        lineHeight: "160px",
        textAlign: "center",
        background: "#364d79",
        width: "100%",
        filter: "grayscale(100%)"
    };
    if (stats) {
        return (
            <>
                <Row
                    style={{
                        position: "relative",
                        margin: "-10px -15px 0px -15px"
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "50vh",
                            overflow: "hidden",
                            position: "relative"
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "50vh",
                                position: "absolute",
                                zIndex: "1",
                                backgroundColor: "rgba(0,0,0,0.6)"
                            }}
                        ></div>
                        <Carousel autoplay dots={false}>
                            {personalities.map(
                                (p, i) =>
                                    p && (
                                        <div key={i}>
                                            <img
                                                style={contentStyle}
                                                src={p.image}
                                            />
                                        </div>
                                    )
                            )}
                        </Carousel>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            zIndex: "2",
                            width: "100%",
                            height: "100%",
                            padding: "7%"
                        }}
                    >
                        <Row
                            style={{
                                height: "25%",
                                color: "#fff",
                                flexDirection: "column",
                                textAlign: "center"
                            }}
                        >
                                <span
                                    style={{
                                        fontSize: "26px"
                                    }}
                                >
                                    {t("home:title")}
                                </span>{" "}
                            <br />
                            <span>{t("home:subtitle")}</span>
                        </Row>
                        <Row
                            style={{
                                height: "60%",
                                color: "#fff",

                                flexDirection: "column"
                            }}
                        >
                            <Row>
                                <p>
                                        <span
                                            style={{
                                                color: "#67BEF2",
                                                fontSize: "34px"
                                            }}
                                        >
                                            {stats.personalities}
                                        </span>{" "}
                                    {t("home:statsPersonalities")}
                                </p>
                            </Row>
                            <Row>
                                <p>
                                        <span
                                            style={{
                                                color: "#67BEF2",
                                                fontSize: "34px"
                                            }}
                                        >
                                            {stats.claims}
                                        </span>{" "}
                                    {t("home:statsClaims")}
                                </p>
                            </Row>
                            <Row>
                                <p>
                                        <span
                                            style={{
                                                color: "#67BEF2",
                                                fontSize: "34px"
                                            }}
                                        >
                                            {stats.reviews}
                                        </span>{" "}
                                    {t("home:statsClaimReviews")}
                                </p>
                            </Row>
                        </Row>
                        <Row
                            style={{
                                height: "15%",
                                color: "#fff",
                                justifyContent: "space-between"
                            }}
                        >
                            <span>{t("home:statsFooter")}</span>
                            <Button href="#create_account">
                                {t("home:createAccountButton")}
                            </Button>
                        </Row>
                    </div>
                </Row>
                <Row>
                    {personalities.map(
                        (p, i) =>
                            p && (
                                <PersonalityCard
                                    personality={p}
                                    summarized={true}
                                    key={p._id}
                                />
                            )
                    )}
                    <Row
                        style={{
                            padding: "10px"
                        }}
                    >
                        <Button href="/personality">
                            {t("home:seeMorePersonalitiesButton")}
                        </Button>
                    </Row>
                </Row>
                <Row
                    id="create_account"
                    style={{
                        margin: "0 -15px"
                    }}
                >
                    <CTARegistration></CTARegistration>
                </Row>
                <SocialMediaShare href={href} />
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
                    left: "calc(50% - 40px)"
                }}
            ></Spin>
        );
    }
}

export default Home;
