import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import CardBase from "../CardBase";
import GridList from "../GridList";
import PersonalityCard from "../Personality/PersonalityCard";

const { Title } = Typography;

const DebateGrid = ({ debates }) => {
    const { t } = useTranslation();
    return (
        <GridList
            title={"Debates"}
            dataSource={debates}
            loggedInMaxColumns={1}
            gridLayout={{
                gutter: 10,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
            }}
            disableSeeMoreButton={true}
            renderItem={(debateClaim) => {
                return (
                    <CardBase
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: colors.lightGray,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                            }}
                        >
                            <Row>
                                <Title
                                    level={3}
                                    style={{
                                        fontSize: "22px",
                                        lineHeight: "32px",
                                        margin: "0 0 16px 0",
                                        fontWeight: 400,
                                        color: colors.grayPrimary,
                                    }}
                                >
                                    {debateClaim.title} (
                                    {t("debates:liveLabel")})
                                </Title>
                            </Row>
                            <Row
                                style={{
                                    justifyContent: "space-evenly",
                                }}
                            >
                                {debateClaim.personalities.map((p) => {
                                    return (
                                        <Col key={p._id} xs={24} md={11}>
                                            <PersonalityCard
                                                personality={p}
                                                summarized={true}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                            <Row
                                style={{
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <Col>
                                    <Button
                                        type={ButtonType.blue}
                                        href={`/claim/${debateClaim.claimId}/debate`}
                                        style={{
                                            fontSize: "12px",
                                            lineHeight: "20px",
                                            height: "auto",
                                            padding: "4px 12px",
                                        }}
                                    >
                                        <span style={{ marginTop: 4 }}>
                                            {t("debates:seeDebate")}
                                        </span>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </CardBase>
                );
            }}
        />
    );
};

export default DebateGrid;
