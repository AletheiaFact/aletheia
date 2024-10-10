import { Col, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import colors from "../../styles/colors";
import Button from "../Button";
import CardBase from "../CardBase";
import GridList from "../GridList";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const { Title } = Typography;

const InterviewGrid = ({ interviews }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <GridList
            title={"Interviews"}
            dataSource={interviews}
            loggedInMaxColumns={1}
            gridLayout={{
                gutter: 10,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
            }}
            disableSeeMoreButton={true}
            renderItem={(interviewClaim) => {
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
                                    {interviewClaim.title} (
                                    {t("debates:liveLabel")})
                                </Title>
                            </Row>
                            <Row
                                style={{
                                    justifyContent: "space-evenly",
                                }}
                            >
                                {interviewClaim.personalities.map((p) => {
                                    return (
                                        <Col key={p._id} xs={24} md={11}>
                                            <PersonalityMinimalCard
                                                personality={p}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                            <Row
                                style={{
                                    justifyContent: "center",
                                    marginTop: "16px",
                                }}
                            >
                                <Col>
                                    <Button
                                        href={
                                            nameSpace !== NameSpaceEnum.Main
                                                ? `/${nameSpace}/claim/${interviewClaim.claimId}/interview`
                                                : `/claim/${interviewClaim.claimId}/interview`
                                        }
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

export default InterviewGrid;
