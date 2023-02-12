import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import CardBase from "../CardBase";
import GridList from "../GridList";
import PersonalityCard from "../Personality/PersonalityCard";

const { Title } = Typography;

const ClaimCollectionGrid = ({ claimCollections }) => {
    const { t } = useTranslation();

    return (
        <GridList
            title={"Debates"}
            dataSource={claimCollections}
            loggedInMaxColumns={1}
            gridLayout={{
                gutter: 10,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
            }}
            disableSeeMoreButton={true}
            seeMoreButtonLabel={t("home:seeMorePersonalitiesButton")}
            renderItem={(cc) => {
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
                                    {cc.title} (
                                    {cc.isLive
                                        ? t("debates:liveLabel")
                                        : t("debates:isEnded")}
                                    )
                                </Title>
                            </Row>
                            <Row
                                style={{
                                    justifyContent: "space-evenly",
                                }}
                            >
                                {cc.personalities.map((p) => {
                                    return (
                                        <Col>
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
                                        href={`/claim-collection/${cc._id}`}
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

export default ClaimCollectionGrid;
