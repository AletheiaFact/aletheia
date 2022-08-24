import React from "react";
import { Col, List, Row } from "antd";
import PersonalityCard from "./PersonalityCard";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../Button";
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../SectionTitle";
import { useAppSelector } from "../../store/store";

const PersonalitiesGrid = ({ personalities, title, loggedInMaxColums = 3 }) => {
    const { t } = useTranslation();

    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));
    const gridLayout = isLoggedIn
        ? {
              xl: loggedInMaxColums,
              xxl: loggedInMaxColums,
          }
        : {
              xl: 2,
              xxl: 2,
          };

    return (
        <>
            <SectionTitle>{title}</SectionTitle>

            <Row>
                <List
                    itemLayout="horizontal"
                    dataSource={personalities}
                    style={{ width: "100%" }}
                    grid={{
                        gutter: 10,
                        xs: 1,
                        sm: 1,
                        md: loggedInMaxColums - 1,
                        lg: 2,
                        ...gridLayout,
                    }}
                    renderItem={(p: any) => {
                        return (
                            <Col
                                style={{
                                    display: "flex",
                                    height: "100%",
                                }}
                            >
                                <PersonalityCard
                                    personality={p}
                                    summarized={true}
                                />
                            </Col>
                        );
                    }}
                />
            </Row>

            <Col
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "48px 0 64px 0",
                }}
            >
                <Button
                    href="/personality"
                    type={ButtonType.blue}
                    data-cy="testSeeMorePersonality"
                >
                    <span
                        style={{
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "24px",
                        }}
                    >
                        {t("home:seeMorePersonalitiesButton")}{" "}
                        <ArrowRightOutlined />
                    </span>
                </Button>
            </Col>
        </>
    );
};

export default PersonalitiesGrid;
