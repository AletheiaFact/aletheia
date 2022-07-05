import React from "react";
import { Col, List, Row } from "antd";
import PersonalityCard from "./PersonalityCard";
import { useTranslation } from 'next-i18next';
import Button, { ButtonType } from '../Button';
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../SectionTitle";

const HomePersonalitiesContainer = ({ isLoggedIn, personalities, title }) => {
    const { t } = useTranslation()

    const gridLayout = isLoggedIn ? {
        xl: 3,
        xxl: 3,
    } : {
        xl: 2,
        xxl: 2,
    }

    return (
        <Col
            span={isLoggedIn ? 18 : 12}
            offset={3}
            className="personalities-container"
        >

            <SectionTitle>
                {title}
            </SectionTitle>

            <Row>
                <List
                    itemLayout='horizontal'
                    dataSource={personalities}
                    grid={{
                        gutter: 10,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2, ...gridLayout
                    }}
                    renderItem={(p: any) => {
                        return (<Col
                            style={{
                                display: "flex",
                                height: "100%",
                            }}
                        >
                            <PersonalityCard
                                personality={p}
                                summarized={true}
                            />
                        </Col>)
                    }}
                />
            </Row>

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
    )
}

export default HomePersonalitiesContainer
