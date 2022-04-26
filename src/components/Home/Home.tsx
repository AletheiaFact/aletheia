import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Carousel, Spin, Col } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import { ArrowRightOutlined } from "@ant-design/icons";
import colors from "../../styles/colors";

const Home = ({ personalities, stats, href, isLoggedIn }) => {
    const { t } = useTranslation();

    if (stats) {
        return (
            <>
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
                                                    color: "#fff",
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
                        >
                            <Col offset={4} span={16}>
                                <Row
                                    style={{
                                        color: "#fff",
                                        margin: "64px 0 32px 0",
                                        width: "314px",
                                    }}
                                >
                                    <h1
                                        style={{
                                            color: "#fff",
                                            fontSize: "40px",
                                            lineHeight: "48px",
                                            margin: 0,
                                        }}
                                    >
                                        {t("home:title")}
                                    </h1>
                                </Row>

                                <Col span="14">
                                    <h2
                                        style={{
                                            color: "#fff",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {t("home:statsFooter")}
                                    </h2>
                                </Col>

                                <Row
                                    style={{
                                        height: "15%",
                                        margin: "32px 0 32px 0",
                                        color: "#fff",
                                        justifyContent: "space-between"
                                    }}
                                    gutter={3}
                                >
                                    <Col span="10">
                                        {  !isLoggedIn  && 
                                            <Button
                                                style={{
                                                    width: "185px",
                                                    height: "40px",
                                                    display: "flex",
                                                    padding: 0,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                                href="#create_account"
                                                type={ButtonType.white}
                                            >
                                                <span style={{ fontWeight: 700 }}>
                                                    {t("home:createAccountButton")}
                                                </span>
                                            </Button>
                                        }
                                    </Col>
                                </Row>
                                
                                <Row
                                    style={{
                                        color: "#fff",
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-between",
                                        height: "55px",
                                    }}
                                >
                                    <Col
                                        span={7}
                                        style={{
                                            height: "100%",
                                        }}
                                    >
                                        <p style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 0,
                                        }}>
                                            <span
                                                style={{
                                                    color: "#67BEF2",
                                                    fontSize: "40px",
                                                    lineHeight: "55px",
                                                    marginRight: 20,
                                                }}
                                            >
                                                {stats.personalities}
                                            </span>{" "}
                                            <span style={{
                                                fontSize: 20,
                                            }}>
                                                {t("home:statsPersonalities")}
                                            </span>
                                        </p>
                                    </Col>
                                    <Col
                                        span={7}
                                        offset={2}
                                        style={{
                                            height: "100%",
                                        }}
                                    >
                                        <p style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 0,
                                        }}>
                                            <span
                                                style={{
                                                    color: "#67BEF2",
                                                    fontSize: "40px",
                                                    lineHeight: "55px",
                                                    marginRight: 20,
                                                }}
                                            >
                                                {stats.claims}
                                            </span>{" "}
                                            <span style={{
                                                fontSize: 20,
                                            }}>
                                                {t("home:statsClaims")}
                                            </span>
                                        </p>
                                    </Col>
                                    <Col
                                        span={7}
                                        offset={1}
                                        style={{
                                            height: "100%",
                                        }}
                                    >
                                        <p style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 0,
                                        }}>
                                            <span
                                                style={{
                                                    color: "#67BEF2",
                                                    fontSize: "40px",
                                                    lineHeight: "55px",
                                                    marginRight: 20,
                                                }}
                                            >
                                                {stats.reviews}
                                            </span>{" "}
                                            <span style={{
                                                fontSize: 20,
                                            }}>
                                                {t("home:statsClaimReviews")}
                                            </span>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </div>
                </Row>
                <Row
                    style={{
                        marginTop: "32px",
                    }}
                >
                    <Col
                        span={12}
                        offset={3}
                    >
                        <Col>
                            <h3
                                style={{
                                    fontSize: "22px",
                                    lineHeight: "32px",
                                    margin: "0 0 16px 0",
                                    fontWeight: 400,
                                    color: colors.grayPrimary
                                }}
                            >
                                Popular today
                            </h3>
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
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    flex: "0 1 326.75px",
                                                }}
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
                            <Col
                                style={{
                                    padding: "20px",
                                    display: "flex",
                                    justifyContent: "center"
                                }}
                            >
                                <Button
                                    href="/personality"
                                    type={ButtonType.whiteBlue}
                                    style={{
                                        width: "240px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 700
                                        }}
                                    >
                                        {t("home:seeMorePersonalitiesButton")} <ArrowRightOutlined />
                                    </span>
                                </Button>
                            </Col>
                        </Col>
                    </Col>
                    <Col
                        span={6}
                        style={{
                            marginLeft: 20
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "22px",
                                lineHeight: "32px",
                                fontWeight: 400,
                                margin: "0 0 16px 0",
                                color: colors.grayPrimary
                            }}
                        >
                            Join the movement
                        </h3>
                        <Row id="create_account">
                            {!isLoggedIn && <CTARegistration></CTARegistration>}
                        </Row>
                        <SocialMediaShare href={href} />
                    </Col>
                </Row>
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
