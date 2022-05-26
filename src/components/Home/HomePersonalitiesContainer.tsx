import React from "react";
import { Col } from "antd";
import PersonalityCard from "../Personality/PersonalityCard";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../SectionTitle";

const PersonalitiesContainer = ({ isLoggedIn, personalities }) => {
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
    )
}

export default PersonalitiesContainer