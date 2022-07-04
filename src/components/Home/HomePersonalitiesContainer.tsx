import React from "react";
import { Col } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../SectionTitle";

const HomePersonalitiesContainer = ({ isLoggedIn, personalities }) => {
    const { t } = useTranslation()

    return (
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
                                    key={p.name}
                                    className="personality-card"
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        marginRight: "10px",
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
                    className="more-personalities-container"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        href="/personality"
                        type={ButtonType.blue}
                        data-cy="testSeeMorePersonality"
                        style={{
                            paddingBottom: 0,
                            height: 40,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "4px",
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
    )
}

export default HomePersonalitiesContainer