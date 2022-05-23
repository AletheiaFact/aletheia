import React from "react";
import CTARegistration from "./CTARegistration";
import { Row, Col } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../SectionTitle";
import styled from "styled-components";

const MainContent = styled.div`
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

    .more-personalities-title {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
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
            margin-left: 0;
            max-width: 100%;
        }

        #create_account,
        .section-join-title {
            margin-left: 12.5%;
            max-width: 75%;
        }
    }

    @media (max-width: 900px) {
        .ant-col-12.personalities-container,
        #create_account,
        .section-join-title {
            margin-left: 8.33333333%;
            max-width: 83.333334%;
        }
    }

    @media (max-width: 725px) {
        .ant-col-12.personalities-container,
        #create_account,
        .section-join-title {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }
    }

    @media (max-width: 548px) {
        #create_account,
        join-container-logged-in {
            margin-left: 0;
            max-width: 100%;
        }
    }
`

const HomeContent = ({ personalities, href, isLoggedIn }) => {
    const { t } = useTranslation();

    return (
        <MainContent>
            <Row className="main-content">
                <Col
                    span={isLoggedIn ? 18 : 12}
                    offset={3}
                    className="personalities-container"
                >
                    <Col>
                        <SectionTitle>
                            {t("home:sectionTitle1")}
                        </SectionTitle>
                        <Col style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between"
                        }}>
                            {personalities.map(
                                (p) =>
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
                                type={ButtonType.blue}
                                style={{
                                    paddingBottom: 0,
                                    height: 40,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "4px",
                                }}
                            >
                                <span className="more-personalities-title">
                                    {t("home:seeMorePersonalitiesButton")} <ArrowRightOutlined />
                                </span>
                            </Button>
                        </Col>
                    </Col>
                </Col>
                <Col span={isLoggedIn ? 24 : 6}
                    className={`join-container ${isLoggedIn ? "join-container-logged-in" : ""}`}>
                    {!isLoggedIn &&
                        <>
                            <Row className="section-join-title">
                                <SectionTitle>
                                    {t("home:sectionTitle2")}
                                </SectionTitle>
                            </Row>

                            <Row id="create_account">
                                <CTARegistration></CTARegistration>
                            </Row>
                        </>
                    }
                    <SocialMediaShare href={href} />
                </Col>
            </Row>
        </MainContent>
    )
}

export default HomeContent
