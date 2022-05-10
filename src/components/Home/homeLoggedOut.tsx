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
            border: 1px solid red;
        }

        .more-personalities-container {
            margin: 16px 0 32px 0;
        }

        .join-container {
            margin-left: 12.5%;
            max-width: 75%;
        }
    }

    @media (max-width: 900px) {
        .ant-col-12.personalities-container,
        .join-container {
            margin-left: 8.33333333%;
            max-width: 83.333334%;
        }
    }

    @media (max-width: 725px) {
        .ant-col-12.personalities-container,
        .join-container {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }
    }

    @media (max-width: 548px) {
        .ant-col-12.personalities-container {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }

        .join-container {
          margin-left: 0;
          max-width: 100%;
      }
    }
`


const HomeLoggedOut = ({personalities, isLoggedIn, href}) => {
    const { t } = useTranslation();

    return (
        <MainContent>
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
                                type={ButtonType.blue}
                                style={{
                                    paddingBottom: 0,
                                    height: 40,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        lineHeight: "24px",
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
                        <CTARegistration></CTARegistration>
                    </Row>
                    <SocialMediaShare isLoggedIn={isLoggedIn} href={href} />
                </Col>
            </Row>
        </MainContent>
    )
}

export default HomeLoggedOut